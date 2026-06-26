import { useState, useEffect } from 'react';
import { LeadFormData } from '../types/lead';
import { submitLead } from '../lib/leadService';

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

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        collectionSize: '',
        dedicatedSpace: false,
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen]);

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
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
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
      const result = await submitLead(formData);

      // Check if submission was successful before proceeding
      if (!result.success) {
        setErrors({ form: result.message });
        setIsDownloading(false);
        return;
      }

      // Trigger PDF download
      const link = document.createElement('a');
      link.href = '/assets/buyer-guide.pdf';
      link.download = 'ultimate-luxury-humidor-buyers-guide.pdf';
      document.body.appendChild(link);

      try {
        link.click();
      } catch (downloadError) {
        console.error('PDF download failed:', downloadError);
        setErrors({ form: 'Failed to download guide. Please try again.' });
        setIsDownloading(false);
        document.body.removeChild(link);
        return;
      }

      document.body.removeChild(link);

      // Show success message briefly, then close modal
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error processing download:', error);
      setErrors({ form: 'An error occurred. Please try again.' });
      setIsDownloading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear field-level and form-level errors on any change
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.form;
        return newErrors;
      });
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
      role="presentation"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDownloading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
          aria-label="Close modal"
          type="button"
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
            <p id="modal-description" className="text-gray-600 text-sm mb-6">
              Get instant access to "The Ultimate Luxury Humidor Buyer's Guide"
            </p>

            <form onSubmit={handleDownload} className="space-y-4" aria-describedby="modal-description">
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
