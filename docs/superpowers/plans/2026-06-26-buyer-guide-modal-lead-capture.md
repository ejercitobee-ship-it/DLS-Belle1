# Modal-Based Buyer's Guide Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable modal popup to the homepage that captures leads for the "Ultimate Luxury Humidor Buyer's Guide" PDF, submits lead data via email, and triggers immediate PDF download on the client.

**Architecture:** A modal component (`BuyerGuideModal`) is triggered by a homepage button. The form validates locally, sends lead data to a Zapier webhook (which emails support), and downloads the PDF directly from `public/assets/buyer-guide.pdf` without requiring server confirmation. The modal closes after successful download. State is managed in the parent homepage component.

**Tech Stack:** React, TypeScript, Tailwind CSS, client-side form validation, Fetch API, Zapier webhooks.

---

## File Structure

**New Files:**
- `src/components/BuyerGuideModal.tsx` — Reusable modal component with form and download logic
- `src/types/lead.ts` — TypeScript interfaces for lead data
- `src/lib/leadService.ts` — Lead/email service abstraction

**Modified Files:**
- Homepage component (likely `src/pages/Home.tsx` or main view) — Add button and modal state management
- `public/assets/buyer-guide.pdf` — PDF file (assume already exists or will be added)

---

## Task 1: Create Types and Lead Service

**Files:**
- Create: `src/types/lead.ts`
- Create: `src/lib/leadService.ts`

- [ ] **Step 1: Write lead types**

```typescript
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
```

- [ ] **Step 2: Create lead service that sends to Zapier webhook**

```typescript
// src/lib/leadService.ts
import { LeadFormData, LeadSubmissionResponse } from '@/types/lead';

const ZAPIER_WEBHOOK_URL = process.env.VITE_ZAPIER_WEBHOOK_URL || '';

export const submitLead = async (data: LeadFormData): Promise<LeadSubmissionResponse> => {
  if (!ZAPIER_WEBHOOK_URL) {
    console.warn('Zapier webhook not configured. Lead data not sent.');
    return {
      success: true,
      message: 'Form submitted locally',
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
      // Still succeed locally so PDF downloads
      return {
        success: true,
        message: 'Form submitted',
      };
    }

    return {
      success: true,
      message: 'Thank you! Check your email.',
    };
  } catch (error) {
    console.error('Lead submission error:', error);
    // Don't block PDF download if email service fails
    return {
      success: true,
      message: 'Form submitted',
    };
  }
};
```

- [ ] **Step 3: Commit types and service**

```bash
git add src/types/lead.ts src/lib/leadService.ts
git commit -m "feat: add lead types and service for buyer guide modal"
```

---

## Task 2: Create BuyerGuideModal Component

**Files:**
- Create: `src/components/BuyerGuideModal.tsx`

- [ ] **Step 1: Create modal component with form and validation**

```typescript
// src/components/BuyerGuideModal.tsx
import { useState } from 'react';
import { LeadFormData } from '@/types/lead';
import { submitLead } from '@/lib/leadService';

interface BuyerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyerGuideModal = ({ isOpen, onClose }: BuyerGuideModalProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    collectionSize: '',
    dedicatedSpace: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsDownloading(true);

    try {
      // Submit lead data to Zapier webhook
      await submitLead(formData);

      // Trigger PDF download
      const link = document.createElement('a');
      link.href = '/assets/buyer-guide.pdf';
      link.download = 'ultimate-luxury-humidor-buyers-guide.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message briefly, then close modal
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          collectionSize: '',
          dedicatedSpace: false,
        });
      }, 2000);
    } catch (error) {
      console.error('Error processing download:', error);
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDownloading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDownloading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {showSuccess ? (
          // Success Message
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <svg className="w-16 h-16 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Download Starting!</h3>
            <p className="text-gray-600">Check your email for the guide and next steps.</p>
          </div>
        ) : (
          // Form
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Download Free Guide
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Get instant access to "The Ultimate Luxury Humidor Buyer's Guide"
            </p>

            <form onSubmit={handleDownload} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                  disabled={isDownloading}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                  disabled={isDownloading}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                  disabled={isDownloading}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Collection Size (Optional) */}
              <div>
                <label htmlFor="collectionSize" className="block text-sm font-medium text-gray-900 mb-1">
                  Collection Size (optional)
                </label>
                <select
                  id="collectionSize"
                  name="collectionSize"
                  value={formData.collectionSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                  disabled={isDownloading}
                >
                  <option value="">Select collection size...</option>
                  <option value="0-50">0-50 cigars</option>
                  <option value="50-200">50-200 cigars</option>
                  <option value="200-1000">200-1,000 cigars</option>
                  <option value="1000+">1,000+ cigars</option>
                </select>
              </div>

              {/* Dedicated Space (Optional) */}
              <div className="flex items-center">
                <input
                  id="dedicatedSpace"
                  name="dedicatedSpace"
                  type="checkbox"
                  checked={formData.dedicatedSpace}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-gold-600"
                  disabled={isDownloading}
                />
                <label htmlFor="dedicatedSpace" className="ml-2 text-sm text-gray-700">
                  I have dedicated space for a humidor
                </label>
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">{errors.form}</p>
                </div>
              )}

              {/* Download Button */}
              <button
                type="submit"
                disabled={isDownloading}
                className="w-full px-4 py-3 bg-gold-600 text-white font-semibold rounded-lg hover:bg-gold-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {isDownloading ? 'Processing...' : 'Download Guide'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Your information will never be shared.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit modal component**

```bash
git add src/components/BuyerGuideModal.tsx
git commit -m "feat: create BuyerGuideModal component with form and download logic"
```

---

## Task 3: Add Button and Modal State to Homepage

**Files:**
- Modify: Homepage component (likely `src/pages/Home.tsx` or main homepage view)

- [ ] **Step 1: Import modal component at top of homepage**

Add this import with other component imports:

```typescript
import { BuyerGuideModal } from '@/components/BuyerGuideModal';
```

- [ ] **Step 2: Add modal state to homepage component**

Add this state hook inside your homepage component:

```typescript
const [showBuyerGuideModal, setShowBuyerGuideModal] = useState(false);
```

- [ ] **Step 3: Add "Download Free Guide" button to hero section**

Add this button to your hero section (adjust styling/placement to match your design):

```typescript
<button
  onClick={() => setShowBuyerGuideModal(true)}
  className="inline-block px-6 py-3 bg-gold-600 text-white font-semibold rounded-lg hover:bg-gold-700 transition-colors"
>
  Download Free Guide
</button>
```

*(Place this button alongside or near other CTAs in your hero section)*

- [ ] **Step 4: Add modal component to homepage render**

Add this to your homepage JSX (near the end of the component, before closing tags):

```typescript
<BuyerGuideModal 
  isOpen={showBuyerGuideModal} 
  onClose={() => setShowBuyerGuideModal(false)} 
/>
```

- [ ] **Step 5: Type check to ensure no errors**

```bash
npm run typecheck
```

Expected: All checks pass

- [ ] **Step 6: Commit homepage changes**

```bash
git add src/pages/Home.tsx
git commit -m "feat: add buyer guide download button and modal to homepage"
```

---

## Task 4: Environment Configuration

**Files:**
- Modify: `.env.local` or `.env.example`

- [ ] **Step 1: Add Zapier webhook URL to environment**

In your `.env.local`, add:

```
VITE_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/YOUR_CATCHHOOK_ID
```

*(To get this URL, create a Zapier zap as outlined in Task 5 below)*

- [ ] **Step 2: Verify environment variable is accessible**

No code change needed — the leadService already reads from `process.env.VITE_ZAPIER_WEBHOOK_URL`

- [ ] **Step 3: Commit environment example**

```bash
git add .env.example
git commit -m "docs: add Zapier webhook URL to environment config"
```

---

## Task 5: PDF Asset Setup

**Files:**
- Add: `public/assets/buyer-guide.pdf`

- [ ] **Step 1: Create public/assets folder if it doesn't exist**

```bash
mkdir -p public/assets
```

- [ ] **Step 2: Place PDF in public folder**

Copy the existing `THE ULTIMATE LUXURY HUMIDOR BUYER'S GUIDE.pdf` to:

```
public/assets/buyer-guide.pdf
```

- [ ] **Step 3: Verify PDF is accessible**

Start dev server and navigate to: `http://localhost:5173/assets/buyer-guide.pdf`

Expected: PDF file downloads

- [ ] **Step 4: Commit PDF asset**

```bash
git add public/assets/buyer-guide.pdf
git commit -m "assets: add Ultimate Luxury Humidor Buyer's Guide PDF"
```

---

## Task 6: Test Modal End-to-End

**Files:**
- None (testing only)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: Server runs on `http://localhost:5173`

- [ ] **Step 2: Navigate to homepage**

Open `http://localhost:5173` in browser

- [ ] **Step 3: Click "Download Free Guide" button**

Expected: Modal pops up with form fields visible

- [ ] **Step 4: Test form validation**

Try submitting with empty fields:
- Expected: Error messages appear for name, email, phone
- Expected: Optional fields (collection size, dedicated space) don't show errors

- [ ] **Step 5: Test email validation**

Enter invalid email (e.g., "test@"):
- Expected: Error message "Please enter a valid email address"

- [ ] **Step 6: Test phone validation**

Enter invalid phone (e.g., "abc"):
- Expected: Error message "Please enter a valid phone number"

- [ ] **Step 7: Fill form correctly and test download**

Fill all required fields:
- Name: "John Doe"
- Email: "john@example.com"
- Phone: "(555) 123-4567"
- Collection Size: "200-1000" (optional)
- Dedicated Space: Check (optional)

Click "Download Guide":
- Expected: Button shows "Processing..."
- Expected: PDF downloads to default download location
- Expected: Success message displays
- Expected: Modal closes after 2 seconds
- Expected: Lead data email sent to support (check Zapier logs)

- [ ] **Step 8: No commit needed (testing only)**

---

## Task 7: Zapier Webhook Setup (Manual)

**Files:**
- None (external Zapier configuration)

- [ ] **Step 1: Create Zapier Zap**

In Zapier.com:
1. Create New Zap
2. **Trigger:** Webhooks by Zapier → Catch Hook
3. Copy the webhook URL provided
4. Test the trigger (you can send a test request from the form later)

- [ ] **Step 2: Create Email Action**

5. **Action:** Gmail (or Outlook, or Zapier Email)
6. Connect your email account (use support@dunnluxuryselections.com)
7. Set up email template:

```
To: support@dunnluxuryselections.com
Subject: New Buyer's Guide Lead - {{name}}

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Collection Size: {{collection_size}}
Dedicated Space: {{dedicated_space}}
Submitted: {{timestamp}}
Source: {{source}}

---
Next steps: Follow up with prospect about humidor needs.
```

- [ ] **Step 3: Add webhook URL to .env.local**

Copy the webhook URL from Step 1 and set in `.env.local`:

```
VITE_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK_ID
```

- [ ] **Step 4: Turn on Zap**

In Zapier, enable the zap so it's actively listening

- [ ] **Step 5: Test end-to-end**

Submit a test form from the modal. Verify:
- Email arrives in support inbox
- Email contains all lead data
- PDF download worked

---

## Task 8: Update Tailwind Gold Color (if needed)

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Check if gold color exists**

Open `tailwind.config.ts` and search for `gold`. If it exists and matches the brand, skip to Step 3.

If not found, add this to the `extend.colors` section:

```typescript
gold: {
  50: '#fefdf2',
  100: '#fdfae5',
  200: '#fcf4cc',
  300: '#f9e8a0',
  400: '#f6d764',
  500: '#f0b70a',
  600: '#d4a60d',
  700: '#b0860e',
  800: '#8d6911',
  900: '#705513',
},
```

- [ ] **Step 2: Type check**

```bash
npm run typecheck
```

Expected: No errors

- [ ] **Step 3: Commit (if changes made)**

```bash
git add tailwind.config.ts
git commit -m "config: add gold color palette to Tailwind"
```
