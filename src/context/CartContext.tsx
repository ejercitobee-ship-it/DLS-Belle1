import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  fetchCart,
  getShopifyConfigured,
  type ShopifyCart,
} from '../lib/shopify';

const CART_ID_KEY = 'dunns_shopify_cart_id';
const LOCAL_CART_KEY = 'dunns_cart';

export type CartItem = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
  category?: string;
  shopifyVariantId?: string;
  shopifyLineId?: string;
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
  checkoutUrl: string | null;
  isShopifyConfigured: boolean;
  shopifyCart: ShopifyCart | null;
  shopifyCheckout: () => Promise<{ url: string | null; fallback: boolean }>;
};

const CartContext = createContext<CartContextType | null>(null);

function getSavedCartId(): string | null {
  return localStorage.getItem(CART_ID_KEY);
}
function saveCartId(id: string) {
  localStorage.setItem(CART_ID_KEY, id);
}
function clearCartId() {
  localStorage.removeItem(CART_ID_KEY);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const syncLock = useRef(false);
  const pendingSync = useRef(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  }, [items]);

  // Restore persisted Shopify cart on mount
  useEffect(() => {
    if (!getShopifyConfigured()) return;
    const savedId = getSavedCartId();
    if (!savedId) return;
    fetchCart(savedId)
      .then((cart) => {
        if (cart) {
          setShopifyCart(cart);
          setCheckoutUrl(cart.checkoutUrl);
        } else {
          clearCartId();
        }
      })
      .catch(() => clearCartId());
  }, []);

  // Sync local items → Shopify cart whenever items change
  useEffect(() => {
    if (!getShopifyConfigured()) return;
    const shopifyItems = items.filter((i) => i.shopifyVariantId);
    if (shopifyItems.length === 0) return;

    if (syncLock.current) {
      pendingSync.current = true;
      return;
    }

    async function doSync() {
      syncLock.current = true;
      try {
        const savedId = getSavedCartId();

        if (!savedId) {
          const cart = await cartCreate(
            shopifyItems.map((i) => ({
              merchandiseId: i.shopifyVariantId!,
              quantity: i.quantity,
            })),
          );
          saveCartId(cart.id);
          setShopifyCart(cart);
          setCheckoutUrl(cart.checkoutUrl);
          setItems((prev) =>
            prev.map((item) => {
              if (!item.shopifyVariantId) return item;
              const line = cart.lines.find((l) => l.merchandise.id === item.shopifyVariantId);
              return line ? { ...item, shopifyLineId: line.id } : item;
            }),
          );
        } else {
          let cart = shopifyCart;
          if (!cart) {
            cart = await fetchCart(savedId);
            if (!cart) {
              clearCartId();
              syncLock.current = false;
              return doSync();
            }
          }

          const shopifyLineMap = new Map(cart.lines.map((l) => [l.merchandise.id, l]));
          const toAdd: { merchandiseId: string; quantity: number }[] = [];
          const toUpdate: { id: string; quantity: number }[] = [];

          for (const item of shopifyItems) {
            const existing = shopifyLineMap.get(item.shopifyVariantId!);
            if (!existing) {
              toAdd.push({ merchandiseId: item.shopifyVariantId!, quantity: item.quantity });
            } else if (existing.quantity !== item.quantity) {
              toUpdate.push({ id: existing.id, quantity: item.quantity });
            }
          }

          const localVariantIds = new Set(shopifyItems.map((i) => i.shopifyVariantId!));
          const toRemove = cart.lines
            .filter((l) => !localVariantIds.has(l.merchandise.id))
            .map((l) => l.id);

          let updatedCart = cart;
          if (toAdd.length) updatedCart = await cartLinesAdd(savedId, toAdd);
          if (toUpdate.length) updatedCart = await cartLinesUpdate(savedId, toUpdate);
          if (toRemove.length) updatedCart = await cartLinesRemove(savedId, toRemove);

          setShopifyCart(updatedCart);
          setCheckoutUrl(updatedCart.checkoutUrl);
          setItems((prev) =>
            prev.map((item) => {
              if (!item.shopifyVariantId) return item;
              const line = updatedCart.lines.find((l) => l.merchandise.id === item.shopifyVariantId);
              return line ? { ...item, shopifyLineId: line.id } : item;
            }),
          );
        }
      } catch (err) {
        console.error('[Cart sync error]', err);
      } finally {
        syncLock.current = false;
        if (pendingSync.current) {
          pendingSync.current = false;
          doSync();
        }
      }
    }

    doSync();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const clearCart = () => {
    setItems([]);
    clearCartId();
    setShopifyCart(null);
    setCheckoutUrl(null);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.priceNum * i.quantity, 0);

  const shopifyCheckout = async (): Promise<{ url: string | null; fallback: boolean }> => {
    if (!getShopifyConfigured()) return { url: null, fallback: true };
    const lines = items
      .filter((i) => i.shopifyVariantId)
      .map((i) => ({ merchandiseId: i.shopifyVariantId!, quantity: i.quantity }));
    if (lines.length === 0) return { url: null, fallback: true };
    try {
      // Always create a fresh cart to avoid expired checkout URLs
      clearCartId();
      const cart = await cartCreate(lines);
      saveCartId(cart.id);
      setShopifyCart(cart);
      setCheckoutUrl(cart.checkoutUrl);
      return { url: cart.checkoutUrl, fallback: false };
    } catch {
      return { url: null, fallback: true };
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        checkoutUrl,
        isShopifyConfigured: getShopifyConfigured(),
        shopifyCart,
        shopifyCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
