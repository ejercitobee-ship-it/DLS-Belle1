export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  createdAt: string;
}

export interface NewArrivalProduct {
  id: string;
  title: string;
  handle: string;
  price: string;
  image: {
    url: string;
    alt: string;
  };
}
