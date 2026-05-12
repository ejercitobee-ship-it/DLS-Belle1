import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPPORT_EMAIL = "support@dunnluxuryselections.com";
const FALLBACK_EMAIL = "ejercitobee@gmail.com";

interface Payload {
  type: "newsletter" | "inquiry";
  email: string;
  name?: string;
  phone?: string;
  projectType?: string;
  spaceSize?: string;
  message?: string;
}

function newsletterHtml(email: string, date: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#1a1714;font-family:Georgia,serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="border-bottom:2px solid #c9912a;padding-bottom:16px;margin-bottom:28px;">
    <h1 style="color:#c9912a;font-size:22px;margin:0;">Dunn's Luxury Selections</h1>
    <p style="color:#a09080;font-size:12px;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">New Subscriber Notification</p>
  </div>
  <h2 style="color:#f0e6d0;font-size:18px;margin:0 0 20px;">New Newsletter Subscriber</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:10px 12px;background:#2a2420;color:#a09080;font-size:13px;width:130px;border-bottom:1px solid #3a3028;">Email</td>
      <td style="padding:10px 12px;background:#2a2420;color:#f0e6d0;font-size:13px;border-bottom:1px solid #3a3028;">${email}</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;color:#a09080;font-size:13px;width:130px;">Submitted</td>
      <td style="padding:10px 12px;color:#f0e6d0;font-size:13px;">${date}</td>
    </tr>
  </table>
  <p style="color:#6a5a4a;font-size:11px;margin-top:32px;border-top:1px solid #3a3028;padding-top:16px;">
    Automated notification from dunnluxuryselections.com
  </p>
</div>
</body>
</html>`;
}

function inquiryHtml(p: Payload, date: string): string {
  const rows: [string, string][] = [
    ["Name", p.name ?? "—"],
    ["Email", p.email],
    ["Phone", p.phone || "Not provided"],
    ["Project Type", p.projectType ?? "—"],
    ["Space Size", p.spaceSize || "Not specified"],
    ["Submitted", date],
  ];
  const rowsHtml = rows.map(([label, value], i) => `
    <tr>
      <td style="padding:10px 12px;background:${i % 2 === 0 ? "#2a2420" : "#241f1b"};color:#a09080;font-size:13px;width:130px;border-bottom:1px solid #3a3028;">${label}</td>
      <td style="padding:10px 12px;background:${i % 2 === 0 ? "#2a2420" : "#241f1b"};color:#f0e6d0;font-size:13px;border-bottom:1px solid #3a3028;">${value}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#1a1714;font-family:Georgia,serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <div style="border-bottom:2px solid #c9912a;padding-bottom:16px;margin-bottom:28px;">
    <h1 style="color:#c9912a;font-size:22px;margin:0;">Dunn's Luxury Selections</h1>
    <p style="color:#a09080;font-size:12px;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">Walk-In Humidor Enquiry</p>
  </div>
  <h2 style="color:#f0e6d0;font-size:18px;margin:0 0 20px;">New Walk-In Humidor Enquiry</h2>
  <table style="width:100%;border-collapse:collapse;">
    ${rowsHtml}
  </table>
  ${p.message ? `
  <div style="margin-top:24px;">
    <p style="color:#a09080;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">Message</p>
    <div style="background:#2a2420;border-left:3px solid #c9912a;padding:16px;border-radius:0 4px 4px 0;">
      <p style="color:#f0e6d0;font-size:13px;line-height:1.7;margin:0;">${p.message.replace(/\n/g, "<br>")}</p>
    </div>
  </div>` : ""}
  <div style="margin-top:24px;padding:16px;background:#2a2420;border-radius:4px;border:1px solid #c9912a30;">
    <p style="color:#a09080;font-size:12px;margin:0;">Reply directly to respond to ${p.name ?? "the enquirer"} at <a href="mailto:${p.email}" style="color:#c9912a;">${p.email}</a></p>
  </div>
  <p style="color:#6a5a4a;font-size:11px;margin-top:32px;border-top:1px solid #3a3028;padding-top:16px;">
    Automated notification from dunnluxuryselections.com
  </p>
</div>
</body>
</html>`;
}

async function sendEmail(
  resendKey: string,
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Dunn's Luxury Selections <onboarding@resend.dev>",
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
    }),
  });

  if (res.ok) return { ok: true };
  const errBody = await res.json().catch(() => ({}));
  return { ok: false, error: JSON.stringify(errBody) };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: Payload = await req.json();

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Always save to Supabase first — guaranteed persistence
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("submissions").insert({
      type: payload.type,
      email: payload.email,
      name: payload.name ?? null,
      phone: payload.phone ?? null,
      project_type: payload.projectType ?? null,
      space_size: payload.spaceSize ?? null,
      message: payload.message ?? null,
    });

    const resendKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;
    let emailError = "";

    if (resendKey) {
      const date = new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
        dateStyle: "full",
        timeStyle: "short",
      }) + " CST";

      const isInquiry = payload.type === "inquiry";
      const subject = isInquiry
        ? `New Walk-In Humidor Enquiry — ${payload.projectType ?? "General"} from ${payload.name ?? payload.email}`
        : `New Newsletter Subscriber — ${payload.email}`;
      const html = isInquiry ? inquiryHtml(payload, date) : newsletterHtml(payload.email, date);
      const replyTo = isInquiry ? payload.email : undefined;

      // Try sending to the support address first (works once domain is verified in Resend)
      const primary = await sendEmail(resendKey, SUPPORT_EMAIL, subject, html, replyTo);

      if (primary.ok) {
        emailSent = true;
      } else {
        // Fall back to the Resend account owner email (always allowed in test mode)
        const fallback = await sendEmail(resendKey, FALLBACK_EMAIL, `[FOR SUPPORT@] ${subject}`, html, replyTo);
        if (fallback.ok) {
          emailSent = true;
        } else {
          emailError = fallback.error ?? primary.error ?? "";
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, emailSent, emailError: emailError || undefined }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
