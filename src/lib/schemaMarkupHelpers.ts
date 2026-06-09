// src/lib/schemaMarkupHelpers.ts
const BASE_URL = 'https://dunnluxuryselections.com';

// Helper function for safe URL construction
const buildURL = (path: string): string => {
  try {
    return new URL(path, BASE_URL).href;
  } catch {
    console.warn(`Invalid URL path: ${path}, using path as-is`);
    return path;
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
}

export type BreadcrumbSchema = ReturnType<typeof generateBreadcrumbSchema>;

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): BreadcrumbSchema => {
  if (!items || items.length === 0) {
    throw new Error('Breadcrumb items array cannot be empty');
  }

  if (!items.every(item => item.name && item.url)) {
    throw new Error('All breadcrumb items must have name and url properties');
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

export const generateProductSchema = (product: ProductSchema): ProductSchemaType => {
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
        "url": buildURL(product.url)
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

export const generateOrganizationSchema = (): OrganizationSchemaType => ({
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
