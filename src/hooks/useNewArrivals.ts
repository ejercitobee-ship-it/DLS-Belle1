import { useEffect, useState } from 'react';

export interface NewArrivalProduct {
  id: string;
  handle: string;
  title: string;
  price: string | number;
  image: {
    url: string;
    alt: string;
  };
}

export const useNewArrivals = () => {
  const [products, setProducts] = useState<NewArrivalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
        const accessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

        if (!storeDomain || !accessToken) {
          throw new Error('Shopify credentials not configured');
        }

        const query = `
          query GetNewArrivals {
            collection(handle: "new-arrivals") {
              products(first: 12) {
                edges {
                  node {
                    id
                    handle
                    title
                    priceRange {
                      minVariantPrice {
                        amount
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(`https://${storeDomain}/api/2024-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': accessToken,
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const collection = data.data.collection;
        if (!collection) {
          throw new Error('New Arrivals collection not found');
        }

        const formattedProducts = collection.products.edges.map((edge: any) => {
          const node = edge.node;
          const image = node.images.edges[0]?.node;
          const price = node.priceRange.minVariantPrice.amount;

          return {
            id: node.id,
            handle: node.handle,
            title: node.title,
            price: parseFloat(price).toFixed(0),
            image: {
              url: image?.url || '',
              alt: image?.altText || node.title,
            },
          };
        });

        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return {
    products,
    loading,
    error,
  };
};
