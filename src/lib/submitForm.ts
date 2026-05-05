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

/**
 * Inserts a form submission into the Supabase `submissions` table.
 * The table has RLS permitting anonymous inserts.
 * Returns null on success, or an error message string on failure.
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

  const { error } = await supabase.from('submissions').insert(row);

  if (error) {
    console.error('Form submission error:', error);
    return error.message || 'Submission failed. Please try again.';
  }

  return null;
}
