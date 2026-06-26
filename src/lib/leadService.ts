// src/lib/leadService.ts
import { LeadFormData, LeadSubmissionResponse } from '../types/lead';

const SUPPORT_EMAIL = 'support@dunnluxuryselections.com';

export const submitLead = async (data: LeadFormData): Promise<LeadSubmissionResponse> => {
  try {
    const emailContent = `New Buyer's Guide Lead Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Collection Size: ${data.collectionSize || 'Not specified'}
Has Dedicated Space: ${data.dedicatedSpace ? 'Yes' : 'No'}
Timestamp: ${new Date().toISOString()}`;

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: SUPPORT_EMAIL,
        subject: `New Lead: ${data.name} - Buyer's Guide Download`,
        text: emailContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Lead submission failed:', result.error);
      return {
        success: false,
        message: result.error || 'Lead submission failed',
      };
    }

    return {
      success: true,
      message: 'Thank you! Check your email.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Lead submission error:', errorMessage);
    return {
      success: false,
      message: 'Lead submission failed',
    };
  }
};
