// src/lib/leadService.ts
import { LeadFormData, LeadSubmissionResponse } from '../types/lead';

const ZAPIER_WEBHOOK_URL = process.env.VITE_ZAPIER_WEBHOOK_URL || '';

export const submitLead = async (data: LeadFormData): Promise<LeadSubmissionResponse> => {
  if (!ZAPIER_WEBHOOK_URL) {
    console.warn('Zapier webhook not configured. Lead data not sent.');
    return {
      success: false,
      message: 'Lead service not configured',
    };
  }

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        collection_size: data.collectionSize || 'Not specified',
        dedicated_space: data.dedicatedSpace ?? false,
        timestamp: new Date().toISOString(),
        source: 'buyer-guide-modal',
      }),
    });

    if (!response.ok) {
      console.error('Lead submission failed:', response.status);
      return {
        success: false,
        message: 'Lead submission failed',
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
