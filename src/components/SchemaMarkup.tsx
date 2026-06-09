// src/components/SchemaMarkup.tsx
import { useEffect } from 'react';
import type { BreadcrumbSchema, ProductSchemaType, OrganizationSchemaType } from '../lib/schemaMarkupHelpers';

type ValidSchema = BreadcrumbSchema | ProductSchemaType | OrganizationSchemaType | Record<string, any>;

interface SchemaMarkupProps {
  schema: ValidSchema;
}

export default function SchemaMarkup({ schema }: SchemaMarkupProps) {
  useEffect(() => {
    if (!schema) {
      console.warn('SchemaMarkup: Invalid schema provided');
      return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [schema]);

  return null;
}
