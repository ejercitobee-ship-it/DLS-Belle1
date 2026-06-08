// src/lib/schemaMarkupHelpers.ts
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

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": new URL(item.url, "https://dunnluxuryselections.com").href
  }))
});

export const generateProductSchema = (product: ProductSchema) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": new URL(product.image, "https://dunnluxuryselections.com").href,
  "url": new URL(product.url, "https://dunnluxuryselections.com").href,
  ...(product.price && {
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.currency || "USD",
      "price": product.price,
      "availability": product.availability || "https://schema.org/InStock",
      "url": new URL(product.url, "https://dunnluxuryselections.com").href
    }
  }),
  ...(product.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 0
    }
  })
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dunn's Luxury Selections",
  "url": "https://dunnluxuryselections.com",
  "description": "Dunn's Luxury Selections offers bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.",
  "logo": "https://dunnluxuryselections.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "1-888-431-9214",
    "email": "support@dunnluxuryselections.com"
  }
});
