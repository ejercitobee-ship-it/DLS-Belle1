import { Sparkles } from 'lucide-react';

interface CustomizationCTAProps {
  useCase?: 'man-cave' | 'lounge' | 'retail' | 'custom';
}

const useCaseMessages: Record<string, { title: string; description: string }> = {
  'man-cave': {
    title: 'Create Your Sanctuary',
    description: 'Not quite right? Our specialists can customize this humidor for your perfect man cave setup.',
  },
  'lounge': {
    title: 'Build Your Signature Experience',
    description: 'Want something unique for your cigar lounge? We design custom solutions that impress.',
  },
  'retail': {
    title: 'Showcase Your Collection',
    description: 'Looking for a premium display solution for your retail store? Let\'s build something extraordinary.',
  },
  'custom': {
    title: 'Can\'t Find What You Need?',
    description: 'We specialize in bespoke designs. Our team can create the perfect custom solution for you.',
  },
};

export function CustomizationCTA({ useCase = 'custom' }: CustomizationCTAProps) {
  const message = useCaseMessages[useCase] || useCaseMessages['custom'];

  return (
    <div className="bg-gradient-to-r from-gold-500/10 to-gold-400/5 border border-gold-500/20 rounded-lg p-6 my-8">
      <div className="flex gap-4">
        <Sparkles size={24} className="text-gold-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gold-300 mb-2">{message.title}</h3>
          <p className="text-cream-200/80 mb-4">{message.description}</p>
          <a
            href="tel:+18884319214"
            className="inline-block px-6 py-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 rounded-lg font-semibold text-sm transition-colors"
          >
            Schedule Your Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
