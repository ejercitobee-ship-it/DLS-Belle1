/**
 * Schema markup utilities for generating structured data.
 *
 * These utilities generate valid JSON-LD schemas. However, consumers are
 * responsible for ensuring input data matches schema.org requirements:
 * - URLs should be valid absolute or relative paths
 * - Ratings should be 1-5
 * - Currency should be valid ISO 4217 code
 * - Availability should be a schema.org availability URL
 *
 * Invalid data will throw an error during generation.
 */

const BASE_URL = 'https://dunnluxuryselections.com';

// Helper function for safe URL construction
const buildURL = (path: string): string => {
  try {
    return new URL(path, BASE_URL).href;
  } catch {
    // If path looks like a relative URL (starts with / or .), return it
    // Otherwise it's malformed - throw the error
    if (path && (path.startsWith('/') || path.startsWith('.'))) {
      return path;
    }
    throw new Error(`Invalid URL: "${path}" is not a valid absolute or relative URL`);
  }
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
  qualifiesForFinancing?: boolean;
}

export type BreadcrumbSchema = ReturnType<typeof generateBreadcrumbSchema>;

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Breadcrumb items must be a non-empty array');
  }

  if (!items.every(item => item.name?.trim() && item.url?.trim())) {
    throw new Error('All breadcrumb items must have non-empty name and url');
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": buildURL(item.url)
    }))
  };
};

export type ProductSchemaType = ReturnType<typeof generateProductSchema>;

export const generateProductSchema = (product: ProductSchema) => {
  if (!product.name || !product.description || !product.image || !product.url) {
    throw new Error('Product schema requires name, description, image, and url');
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": buildURL(product.image),
    "url": buildURL(product.url),
    ...(product.price && {
      "offers": {
        "@type": "Offer",
        "priceCurrency": product.currency || "USD",
        "price": product.price,
        "availability": product.availability || "https://schema.org/InStock",
        "url": buildURL(product.url),
        ...(product.qualifiesForFinancing && {
          "paymentMethod": [
            {
              "@type": "PaymentMethod",
              "name": "Credit Card"
            },
            {
              "@type": "PaymentMethod",
              "name": "Debit Card"
            },
            {
              "@type": "PaymentMethod",
              "name": "Shop Pay",
              "description": "Pay in 4 interest-free installments with Shop Pay — $" + Math.round(product.price / 4) + " every 2 weeks"
            }
          ]
        })
      }
    }),
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 0
      }
    })
  };
};

export type OrganizationSchemaType = ReturnType<typeof generateOrganizationSchema>;

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dunn's Luxury Selections",
  "url": BASE_URL,
  "description": "Dunn's Luxury Selections offers bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.",
  "logo": buildURL("logo.png"),
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "1-888-431-9214",
    "email": "support@dunnluxuryselections.com"
  }
});

export interface FAQItem {
  question: string;
  answer: string;
}

export type FAQPageSchemaType = ReturnType<typeof generateFAQPageSchema>;

export const generateFAQPageSchema = (items: FAQItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('FAQ items must be a non-empty array');
  }

  if (!items.every(item => item.question?.trim() && item.answer?.trim())) {
    throw new Error('All FAQ items must have non-empty question and answer');
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};
