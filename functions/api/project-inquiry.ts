export interface Env {
  RESEND_API_KEY: string;
}

// Recipient is fixed server-side so the endpoint can't be abused as a relay.
const RECIPIENT = 'support@dunnluxuryselections.com';
const FROM = "Dunn's Luxury Selections <online@dunnluxuryselections.com>";

const FORM_LABELS: Record<string, string> = {
  walkin: 'Walk-In Humidor',
  cabinets: 'Cabinet Humidor',
  showcases: 'Cigar Showcase',
};

// Field order + labels per form, for a readable email body.
const FIELD_LABELS: Record<string, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  location: 'City & State',
  spaceType: 'Space type',
  dimensions: 'Approx. dimensions',
  cabinetType: 'Cabinet type',
  preferredFunction: 'Preferred function',
  capacity: 'Capacity needed',
  options: 'Options',
  exteriorFinish: 'Exterior finish',
  furnitureType: 'Type of furniture',
  width: 'Width',
  height: 'Height',
  depth: 'Depth',
  interiorLayout: 'Interior layout',
  details: 'Project details',
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const json = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  try {
    const { request, env } = context;
    const body = await request.json<Record<string, string>>();

    // Honeypot: real users never fill this hidden field. Pretend success.
    if (body.website) return json({ success: true });

    const formLabel = FORM_LABELS[body.formType];
    if (!formLabel) return json({ error: 'Unknown form type' }, 400);

    const firstName = (body.firstName || '').trim();
    const email = (body.email || '').trim();
    if (!firstName || !email) return json({ error: 'Name and email are required' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email address' }, 400);

    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return json({ error: 'Server configuration error' }, 500);
    }

    const fullName = [firstName, (body.lastName || '').trim()].filter(Boolean).join(' ');

    const rows: string[] = [];
    const textLines: string[] = [`New ${formLabel} project inquiry from the portfolio page:`, ''];
    for (const key of Object.keys(FIELD_LABELS)) {
      const value = (body[key] || '').trim();
      if (!value) continue;
      const label = FIELD_LABELS[key];
      rows.push(
        `<tr><td style="padding:6px 14px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td>` +
          `<td style="padding:6px 0;color:#111">${esc(value).replace(/\n/g, '<br>')}</td></tr>`,
      );
      textLines.push(`${label}: ${value}`);
    }

    const html =
      `<h2 style="font-family:Georgia,serif;color:#321a07">New ${formLabel} Project Inquiry</h2>` +
      `<p style="color:#444">Submitted from the bespoke portfolio page (onepager.html).</p>` +
      `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows.join('')}</table>`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: RECIPIENT,
        reply_to: email,
        subject: `New ${formLabel} Project Inquiry — ${fullName}`,
        text: textLines.join('\n'),
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Resend API error:', errorData);
      return json({ error: 'Failed to send inquiry.' }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error processing project inquiry:', error);
    return json({ error: 'Invalid request' }, 400);
  }
};
