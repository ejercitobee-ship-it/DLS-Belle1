import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createShopifyCheckout, getShopifyConfigured } from '../lib/shopify';

export type CartItem = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
  category?: string;
  shopifyVariantId?: string; // gid://shopify/ProductVariant/...
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  shopifyCheckout: () => Promise<{ url: string | null; fallback: boolean }>;
  isShopifyConfigured: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dunns_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dunns_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.priceNum * i.quantity, 0);

  const shopifyCheckout = async (): Promise<{ url: string | null; fallback: boolean }> => {
    if (!getShopifyConfigured()) return { url: null, fallback: true };
    const lines = items
      .filter((i) => i.shopifyVariantId)
      .map((i) => ({ variantId: i.shopifyVariantId!, quantity: i.quantity }));
    if (lines.length === 0) return { url: null, fallback: true };
    try {
      const url = await createShopifyCheckout(lines);
      return { url, fallback: false };
    } catch {
      return { url: null, fallback: true };
    }
  };

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, subtotal, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      shopifyCheckout,
      isShopifyConfigured: getShopifyConfigured(),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
