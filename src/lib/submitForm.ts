import { supabase } from './supabase';

export interface NewsletterPayload {
  type: 'newsletter';
  email: string;
}

export interface InquiryPayload {
  type: 'inquiry';
  email: string;
  name: string;
  phone?: string;
  projectType?: string;
  spaceSize?: string;
  message?: string;
}

export type FormPayload = NewsletterPayload | InquiryPayload;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Calls the shopify-customer Edge Function which:
 *   1. Saves the submission to the `submissions` table via service-role key.
 *   2. Sends a Resend email notification to support@dunnluxuryselections.com.
 *
 * Returns null on success, or an error string on failure.
 */
async function callEdgeFunction(payload: FormPayload): Promise<string | null> {
  if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
    return 'Supabase URL not configured';
  }

  const url = `${SUPABASE_URL}/functions/v1/shopify-customer`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log('[submitForm] ✅ Edge function succeeded.', data);
      return null;
    }

    const errBody = await res.text().catch(() => '(no body)');
    console.error('[submitForm] ❌ Edge function error:', res.status, errBody);
    return `Edge function HTTP ${res.status}: ${errBody}`;
  } catch (err) {
    console.error('[submitForm] ❌ Edge function network error:', err);
    return String(err);
  }
}

/**
 * Attempts a raw REST POST to Supabase, bypassing the JS client.
 * Used as a last-resort fallback (no email notification).
 */
async function restInsert(row: Record<string, unknown>): Promise<string | null> {
  if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
    return 'Supabase URL not configured';
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '(no body)');
      console.error('[submitForm] REST fallback failed:', res.status, res.statusText, body);
      return `HTTP ${res.status}: ${body}`;
    }
    return null;
  } catch (err) {
    console.error('[submitForm] REST fallback network error:', err);
    return String(err);
  }
}

/**
 * Submits a form payload.
 *
 * Strategy:
 *   1. Call the shopify-customer Edge Function — saves to DB + sends email notification.
 *   2. On failure, try the Supabase JS client insert (DB only, no email).
 *   3. On failure, try a direct REST fetch insert (DB only, no email).
 *   4. All failures → return a detailed error string so the caller can surface a mailto fallback.
 *
 * Returns null on success, or an error message string on failure.
 */
export async function submitForm(payload: FormPayload): Promise<string | null> {
  const keyPrefix = SUPABASE_KEY?.slice(0, 8) ?? '(none)';
  const keyLooksWrong = !SUPABASE_KEY || SUPABASE_KEY.startsWith('sbp_') || SUPABASE_KEY === 'placeholder-anon-key';

  if (keyLooksWrong) {
    console.error(
      '[submitForm] ⚠️  VITE_SUPABASE_ANON_KEY appears to be a Personal Access Token ' +
        `("${keyPrefix}...") rather than a project anon key (JWT starting with "eyJ"). ` +
        'Go to Supabase → Project Settings → API → anon public key and update the env var.'
    );
  }

  // --- Attempt 1: Edge Function (DB insert + email notification) ---
  console.log('[submitForm] Attempt 1 – shopify-customer Edge Function', { url: SUPABASE_URL, keyPrefix, payload });
  const edgeError = await callEdgeFunction(payload);

  if (!edgeError) {
    return null;
  }

  console.warn('[submitForm] ⚠️  Edge function failed, falling back to direct DB insert (no email):', edgeError);

  const row =
    payload.type === 'newsletter'
      ? { type: 'newsletter', email: payload.email }
      : {
          type: 'inquiry',
          email: payload.email,
          name: (payload as InquiryPayload).name,
          phone: (payload as InquiryPayload).phone ?? null,
          project_type: (payload as InquiryPayload).projectType ?? null,
          space_size: (payload as InquiryPayload).spaceSize ?? null,
          message: (payload as InquiryPayload).message ?? null,
        };

  // --- Attempt 2: Supabase JS client ---
  console.log('[submitForm] Attempt 2 – Supabase JS client');
  const { error: clientError } = await supabase.from('submissions').insert(row);

  if (!clientError) {
    console.log('[submitForm] ✅ Supabase JS client insert succeeded (no email sent).');
    return null;
  }

  console.error('[submitForm] ❌ Supabase JS client error:', {
    message: clientError.message,
    code: clientError.code,
    details: clientError.details,
    hint: clientError.hint,
  });

  // --- Attempt 3: direct REST fetch ---
  console.log('[submitForm] Attempt 3 – direct REST fetch fallback…');
  const restError = await restInsert(row);

  if (!restError) {
    console.log('[submitForm] ✅ REST fallback insert succeeded (no email sent).');
    return null;
  }

  console.error('[submitForm] ❌ All submission paths failed.', {
    edgeError,
    clientError: clientError.message,
    restError,
  });

  return clientError.message || restError || 'Submission failed. Please try again.';
}
