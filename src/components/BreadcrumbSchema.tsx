import { ChevronRight } from 'lucide-react';
import { generateBreadcrumbSchema } from '../lib/schemaMarkupHelpers';
import SchemaMarkup from './SchemaMarkup';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function BreadcrumbSchema({ items, className = '' }: BreadcrumbSchemaProps) {
  const schemaItems = items.map(item => ({
    name: item.label,
    url: item.href
  }));

  return (
    <>
      <SchemaMarkup schema={generateBreadcrumbSchema(schemaItems)} />

      <nav className={`flex items-center gap-2 text-sm text-cream-200/60 ${className}`} aria-label="Breadcrumb">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={16} className="text-gold-500/40" />}
            {index === items.length - 1 ? (
              <span className="text-cream-100 font-medium">{item.label}</span>
            ) : (
              <a
                href={item.href}
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                {item.label}
              </a>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
