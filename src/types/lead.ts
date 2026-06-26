// src/types/lead.ts
export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  collectionSize?: string;
  dedicatedSpace?: boolean;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
}
