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
 * Attempts a raw REST POST to Supabase, bypassing the JS client.
 * Useful when the JS client initialises with stale/wrong credentials.
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
 * Inserts a form submission into the Supabase `submissions` table.
 *
 * Strategy:
 *   1. Try the Supabase JS client (standard path).
 *   2. On failure, try a direct REST fetch (bypasses client quirks).
 *   3. Both failures → return a detailed error string so the caller
 *      can surface a mailto fallback to the user.
 *
 * Returns null on success, or an error message string on failure.
 *
 * KNOWN ISSUE: The VITE_SUPABASE_ANON_KEY must be a JWT (starts with
 * "eyJ"), not a Personal Access Token ("sbp_..."). If the key format
 * is wrong, both paths below will return 401/403. In that case the
 * caller should fall back to the mailto path.
 */
export async function submitForm(payload: FormPayload): Promise<string | null> {
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

  const keyPrefix = SUPABASE_KEY?.slice(0, 8) ?? '(none)';
  const keyLooksWrong = !SUPABASE_KEY || SUPABASE_KEY.startsWith('sbp_') || SUPABASE_KEY === 'placeholder-anon-key';

  if (keyLooksWrong) {
    console.error(
      '[submitForm] ⚠️  VITE_SUPABASE_ANON_KEY appears to be a Personal Access Token ' +
        `("${keyPrefix}...") rather than a project anon key (JWT starting with "eyJ"). ` +
        'Go to Supabase → Project Settings → API → anon public key and update the env var.'
    );
  }

  console.log('[submitForm] Attempt 1 – Supabase JS client', {
    url: SUPABASE_URL,
    keyPrefix,
    table: 'submissions',
    row,
  });

  // --- Attempt 1: Supabase JS client ---
  const { error: clientError } = await supabase.from('submissions').insert(row);

  if (!clientError) {
    console.log('[submitForm] ✅ Supabase JS client insert succeeded.');
    return null;
  }

  console.error('[submitForm] ❌ Supabase JS client error:', {
    message: clientError.message,
    code: clientError.code,
    details: clientError.details,
    hint: clientError.hint,
  });

  // --- Attempt 2: direct REST fetch ---
  console.log('[submitForm] Attempt 2 – direct REST fetch fallback…');
  const restError = await restInsert(row);

  if (!restError) {
    console.log('[submitForm] ✅ REST fallback insert succeeded.');
    return null;
  }

  console.error('[submitForm] ❌ All submission paths failed.', {
    clientError: clientError.message,
    restError,
  });

  // Return the most descriptive error for the caller to display / use
  return clientError.message || restError || 'Submission failed. Please try again.';
}
