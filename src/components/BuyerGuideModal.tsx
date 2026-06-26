import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className="bg-gradient-to-b from-charcoal-900 to-charcoal-950 rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto relative border border-gold-500/30">
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
            <h3 className="text-2xl font-serif font-bold text-gold-400 mb-2">Success!</h3>
            <p className="text-cream-200/70">Check your email for the guide and next steps.</p>
          </div>
        ) : (
          // Form
          <>
            <div className="mb-1 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <h2 className="text-3xl font-serif font-bold text-gold-400 mb-1 text-center">
              Buyer's Guide
            </h2>
            <p id="modal-description" className="text-cream-200/70 text-center text-sm mb-6">
              Master climate control, craftsmanship, and investment value before choosing your humidor
            </p>

            <form onSubmit={handleDownload} className="space-y-4" aria-describedby="modal-description">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cream-100 mb-1">
                  Full Name <span className="text-gold-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm transition-all bg-charcoal-800 text-cream-100 placeholder-cream-300/50 ${
                    errors.name ? 'border-red-500' : 'border-gold-500/40 hover:border-gold-500/70'
                  }`}
                  placeholder="Full name"
                  disabled={isDownloading}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-cream-100 mb-1">
                  Email <span className="text-gold-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm transition-all bg-charcoal-800 text-cream-100 placeholder-cream-300/50 ${
                    errors.email ? 'border-red-500' : 'border-gold-500/40 hover:border-gold-500/70'
                  }`}
                  placeholder="you@example.com"
                  disabled={isDownloading}
                />
                {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-cream-100 mb-1">
                  Phone <span className="text-gold-400">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm transition-all bg-charcoal-800 text-cream-100 placeholder-cream-300/50 ${
                    errors.phone ? 'border-red-500' : 'border-gold-500/40 hover:border-gold-500/70'
                  }`}
                  placeholder="(555) 123-4567"
                  disabled={isDownloading}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone}</p>}
              </div>

              {/* Collection Size (Optional) */}
              <div>
                <label htmlFor="collectionSize" className="block text-sm font-medium text-cream-100 mb-1">
                  Collection Size (optional)
                </label>
                <select
                  id="collectionSize"
                  name="collectionSize"
                  value={formData.collectionSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gold-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm bg-charcoal-800 text-cream-100 hover:border-gold-500/70 transition-all"
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
                  className="h-4 w-4 rounded border-gold-500 text-gold-500 bg-charcoal-800"
                  disabled={isDownloading}
                />
                <label htmlFor="dedicatedSpace" className="ml-2 text-sm text-cream-100">
                  I have dedicated space for a humidor
                </label>
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <p className="text-xs text-red-300">{errors.form}</p>
                </div>
              )}

              {/* Download Button */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent my-6" />
              <button
                type="submit"
                disabled={isDownloading}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-gold-600 to-gold-700 text-white font-serif font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-gold-600/50 hover:from-gold-500 hover:to-gold-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Download Here
                    <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-xs text-cream-300/60 text-center mt-4">
                We respect your privacy. Your information will never be shared.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
