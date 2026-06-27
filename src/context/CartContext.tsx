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
import { debounce } from '../utils/debounce';

const CART_ID_KEY = 'dunns_shopify_cart_id';
const LOCAL_CART_KEY = 'dunns_cart';
const DEBOUNCE_DELAY = 50; // 50ms for batching

type PendingOperation = {
  type: 'add' | 'update' | 'remove';
  merchandiseId?: string;
  id?: string;
  quantity?: number;
};

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
  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);

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

  // Flush all pending batched operations to Shopify API
  const flushPendingOperations = async () => {
    if (!getShopifyConfigured() || pendingOperations.length === 0) return;

    const operations = [...pendingOperations];
    setPendingOperations([]);

    try {
      const savedId = getSavedCartId();
      if (!savedId) return;

      const toAdd: { merchandiseId: string; quantity: number }[] = [];
      const toUpdate: { id: string; quantity: number }[] = [];
      const toRemove: string[] = [];

      // Aggregate operations by type
      for (const op of operations) {
        if (op.type === 'add' && op.merchandiseId && op.quantity) {
          toAdd.push({ merchandiseId: op.merchandiseId, quantity: op.quantity });
        } else if (op.type === 'update' && op.id && op.quantity) {
          toUpdate.push({ id: op.id, quantity: op.quantity });
        } else if (op.type === 'remove' && op.id) {
          toRemove.push(op.id);
        }
      }

      let updatedCart = shopifyCart;
      if (!updatedCart) {
        updatedCart = await fetchCart(savedId);
        if (!updatedCart) return;
      }

      if (toAdd.length) updatedCart = await cartLinesAdd(savedId, toAdd);
      if (toUpdate.length) updatedCart = await cartLinesUpdate(savedId, toUpdate);
      if (toRemove.length) updatedCart = await cartLinesRemove(savedId, toRemove);

      setShopifyCart(updatedCart);
      setCheckoutUrl(updatedCart.checkoutUrl);
    } catch (err) {
      console.error('[Cart] Failed to flush pending operations:', err);
      // Restore operations on failure for retry
      setPendingOperations(operations);
    }
  };

  const debouncedFlush = useRef(debounce(flushPendingOperations, DEBOUNCE_DELAY)).current;


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

    // Queue batched operation if it's a Shopify item
    if (newItem.shopifyVariantId && getShopifyConfigured()) {
      setPendingOperations((prev) => [
        ...prev,
        {
          type: 'add',
          merchandiseId: newItem.shopifyVariantId!,
          quantity: 1,
        },
      ]);
      debouncedFlush();
    }

    // Google Analytics 4 - Add to Cart Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: newItem.priceNum,
        items: [{
          item_id: newItem.id,
          item_name: newItem.name,
          price: newItem.priceNum,
          quantity: 1,
        }],
      });
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      // Queue batched removal if it's a Shopify item with a line ID
      if (item && item.shopifyLineId && getShopifyConfigured()) {
        setPendingOperations((prevOps) => [
          ...prevOps,
          {
            type: 'remove',
            id: item.shopifyLineId!,
          },
        ]);
        debouncedFlush();
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return; }
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      // Queue batched update if it's a Shopify item with a line ID
      if (item && item.shopifyLineId && getShopifyConfigured()) {
        setPendingOperations((prevOps) => [
          ...prevOps,
          {
            type: 'update',
            id: item.shopifyLineId!,
            quantity: qty,
          },
        ]);
        debouncedFlush();
      }
      return prev.map((i) => i.id === id ? { ...i, quantity: qty } : i);
    });
  };

  const clearCart = () => {
    setItems([]);
    clearCartId();
    setShopifyCart(null);
    setCheckoutUrl(null);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.priceNum * i.quantity, 0);

  // Track if cart abandonment has been triggered for current session
  const cartAbandonmentTriggered = useRef(false);

  // Trigger cart abandonment email
  const triggerCartAbandonmentEmail = async (email: string, firstName?: string) => {
    if (cartAbandonmentTriggered.current) return;
    if (items.length === 0) return;

    try {
      const cartData = {
        email,
        firstName,
        cartTotal: subtotal,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.priceNum,
          quantity: item.quantity,
        })),
        cartId: getSavedCartId() || undefined,
        cartUrl: checkoutUrl || 'https://dunnluxuryselections.com/cart',
      };

      const response = await fetch('/api/cart-abandonment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData),
      });

      if (response.ok) {
        cartAbandonmentTriggered.current = true;
        console.log('[Cart] Abandonment email triggered');
      }
    } catch (err) {
      console.error('[Cart] Failed to trigger abandonment email:', err);
    }
  };

  // Hook into beforeunload for cart abandonment
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only trigger if there are items in cart and user hasn't completed checkout
      if (items.length > 0 && !cartAbandonmentTriggered.current) {
        // Try to get email from sessionStorage (if user entered it in popup)
        const popupEmail = sessionStorage.getItem('leadPopupEmail');
        const popupFirstName = sessionStorage.getItem('leadPopupFirstName');
        
        if (popupEmail) {
          triggerCartAbandonmentEmail(popupEmail, popupFirstName || undefined);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items, subtotal, checkoutUrl, triggerCartAbandonmentEmail]);

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
