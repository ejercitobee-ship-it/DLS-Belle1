/**
 * DLS-Belle1 Shopify Liquid Theme - Main Script
 * Handles cart drawer, search, mobile navigation, and dynamic behaviors
 */

(function () {
  'use strict';

  const fmt = (cents) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      (Number(cents) || 0) / 100
    );

  const escapeHtml = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  // ── Cart Drawer ─────────────────────────────────────────────────────────────
  function initCartDrawer() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const countEl = document.getElementById('cart-count');
    if (!cartDrawer) return;

    let overlay = document.querySelector('.cart-drawer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'cart-drawer-overlay';
      cartDrawer.insertAdjacentElement('afterend', overlay);
    }

    function updateCount(count) {
      if (!countEl) return;
      countEl.textContent = count;
      if (count > 0) countEl.removeAttribute('hidden');
      else countEl.setAttribute('hidden', '');
    }

    function render(cart) {
      updateCount(cart.item_count);

      const itemsHtml =
        cart.items && cart.items.length
          ? cart.items
              .map((item) => {
                const img =
                  (item.featured_image && item.featured_image.url) || item.image || '';
                const variant =
                  item.variant_title && item.variant_title !== 'Default Title'
                    ? `<p class="cart-line-variant">${escapeHtml(item.variant_title)}</p>`
                    : '';
                return `
                <div class="cart-line" data-key="${escapeHtml(item.key)}">
                  <a href="${item.url}" class="cart-line-img">
                    ${img ? `<img src="${img}" alt="${escapeHtml(item.product_title)}" loading="lazy">` : ''}
                  </a>
                  <div class="cart-line-body">
                    <a href="${item.url}" class="cart-line-title">${escapeHtml(item.product_title)}</a>
                    ${variant}
                    <div class="cart-line-row">
                      <span class="cart-line-price">${fmt(item.final_line_price)}</span>
                      <div class="cart-line-controls">
                        <div class="cart-qty">
                          <button type="button" class="cart-qty-btn" data-action="decrease" data-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">&minus;</button>
                          <span class="cart-qty-val">${item.quantity}</span>
                          <button type="button" class="cart-qty-btn" data-action="increase" data-key="${escapeHtml(item.key)}" aria-label="Increase quantity">&plus;</button>
                        </div>
                        <button type="button" class="cart-remove" data-action="remove" data-key="${escapeHtml(item.key)}" aria-label="Remove item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>`;
              })
              .join('')
          : '';

      const body =
        cart.items && cart.items.length
          ? `
          <div class="cart-drawer-items">${itemsHtml}</div>
          <div class="cart-drawer-footer">
            <div class="cart-drawer-subtotal">
              <span>Subtotal</span>
              <span class="cart-drawer-subtotal-val">${fmt(cart.total_price)}</span>
            </div>
            <p class="cart-drawer-note">Shipping &amp; taxes calculated at checkout.</p>
            <a href="/checkout" class="cart-checkout-btn">Checkout</a>
            <button type="button" class="cart-continue-btn" data-action="close">Continue Shopping</button>
          </div>`
          : `
          <div class="cart-drawer-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <p class="cart-drawer-empty-title">Your cart is empty</p>
            <p class="cart-drawer-empty-sub">Discover our collection of luxury humidors.</p>
            <a href="/collections/all" class="cart-checkout-btn">Browse Humidors</a>
          </div>`;

      cartDrawer.innerHTML = `
        <div class="cart-drawer-header">
          <h2 class="cart-drawer-title">Your Cart${
            cart.item_count > 0 ? ` <span class="cart-drawer-badge">${cart.item_count}</span>` : ''
          }</h2>
          <button type="button" class="cart-drawer-close" data-action="close" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        ${body}`;
    }

    async function refresh() {
      try {
        const res = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
        const cart = await res.json();
        render(cart);
      } catch (e) {
        /* keep previous render */
      }
    }

    async function changeQty(key, quantity) {
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: key, quantity: quantity }),
        });
        const cart = await res.json();
        render(cart);
      } catch (e) {
        refresh();
      }
    }

    function open() {
      cartDrawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      refresh();
    }

    function close() {
      cartDrawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (cartToggle) {
      cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      });
    }

    overlay.addEventListener('click', close);

    // Delegate clicks inside the drawer (rendered dynamically)
    cartDrawer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const key = btn.dataset.key;
      const line = btn.closest('.cart-line');

      if (action === 'close') {
        close();
      } else if (action === 'remove') {
        changeQty(key, 0);
      } else if (action === 'increase' || action === 'decrease') {
        const val = line ? parseInt(line.querySelector('.cart-qty-val').textContent, 10) : 1;
        const next = action === 'increase' ? val + 1 : val - 1;
        changeQty(key, Math.max(0, next));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartDrawer.classList.contains('open')) close();
    });

    // Intercept product add-to-cart forms → AJAX add → open drawer
    document.querySelectorAll('form[action*="/cart/add"]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        const original = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Adding...';
        }
        try {
          const res = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error('add failed');
          open();
        } catch (err) {
          // Fallback to native full-page add
          form.submit();
          return;
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = original;
          }
        }
      });
    });

    // Prime the header count on load
    refresh();
  }

  // ── Mobile Menu ─────────────────────────────────────────────────────────────
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    if (!btn || !nav) return;

    function open() {
      nav.hidden = false;
      nav.classList.add('open');
      if (backdrop) backdrop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      nav.classList.remove('open');
      nav.hidden = true;
      if (backdrop) backdrop.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (nav.classList.contains('open')) close();
      else open();
    });

    if (backdrop) backdrop.addEventListener('click', close);
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) close();
    });
  }

  // ── Header Search (predictive) ──────────────────────────────────────────────
  function initSearch() {
    const toggle = document.getElementById('search-toggle');
    const panel = document.getElementById('search-panel');
    const input = document.getElementById('header-search-input');
    const results = document.getElementById('search-results');
    const closeBtn = document.getElementById('search-close');
    const wrap = toggle ? toggle.closest('.search-wrap') : null;
    if (!toggle || !panel || !input || !results) return;

    let debounce;

    function open() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      setTimeout(() => input.focus(), 30);
    }
    function close() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (panel.hidden) open();
      else close();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);

    document.addEventListener('click', (e) => {
      if (!panel.hidden && wrap && !wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) close();
    });

    async function search(q) {
      try {
        const url =
          '/search/suggest.json?q=' +
          encodeURIComponent(q) +
          '&resources[type]=product&resources[limit]=6&resources[options][unavailable_products]=last';
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        const data = await res.json();
        const products = (data.resources.results.products || []).slice(0, 6);
        const allLink = `<a class="search-all-link" href="${input.form.action}?q=${encodeURIComponent(q)}">View all results &rarr;</a>`;

        if (!products.length) {
          results.innerHTML =
            `<p class="search-empty">No products found for &ldquo;${escapeHtml(q)}&rdquo;.</p>` + allLink;
          return;
        }

        results.innerHTML =
          products
            .map((p) => {
              const img = (p.featured_image && p.featured_image.url) || p.image || '';
              const price = p.price != null ? fmt(parseFloat(p.price) * 100) : '';
              return `
              <a class="search-result-item" href="${p.url}">
                ${img ? `<img src="${img}" alt="${escapeHtml(p.title)}">` : ''}
                <span>
                  <span class="search-result-title">${escapeHtml(p.title)}</span>
                  ${price ? `<span class="search-result-price">${price}</span>` : ''}
                </span>
              </a>`;
            })
            .join('') + allLink;
      } catch (e) {
        results.innerHTML = '';
      }
    }

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clearTimeout(debounce);
      if (q.length < 2) {
        results.innerHTML = '';
        return;
      }
      debounce = setTimeout(() => search(q), 250);
    });
  }

  // ── Product Page: Image Gallery ─────────────────────────────────────────────
  function initProductGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', () => {
        const img = thumbnail.querySelector('img');
        if (img && img.src) {
          mainImage.src = img.src.replace('_100x100', '_800x800');
          thumbnails.forEach((t) => (t.style.borderColor = 'transparent'));
          thumbnail.style.borderColor = 'var(--gold-400)';
        }
      });
    });
  }

  // ── Product Page: Quantity Selector ─────────────────────────────────────────
  function initQuantitySelector() {
    document.querySelectorAll('input[name="quantity"]').forEach((input) => {
      input.addEventListener('input', (e) => {
        e.target.value = Math.max(1, parseInt(e.target.value) || 1);
      });
    });
  }

  // ── Newsletter Form ─────────────────────────────────────────────────────────
  function initNewsletterForm() {
    const newsletterForm = document.querySelector('form[action*="newsletter"]');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
      const email = newsletterForm.querySelector('input[type="email"]');
      if (!email || !email.value.includes('@')) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribed ✓';
      }
    });
  }

  // ── Smooth Scroll Navigation ────────────────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ── GA4 Event: Add to Cart ──────────────────────────────────────────────────
  function trackAddToCart() {
    document.querySelectorAll('form[action*="cart/add"]').forEach((form) => {
      form.addEventListener('submit', () => {
        if (typeof gtag !== 'undefined') {
          const productTitle = document.querySelector('h1')?.textContent || 'Product';
          const priceText = document.querySelector('.product-price')?.textContent || '0';
          const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: price,
            items: [
              {
                item_name: productTitle,
                price: price,
                quantity: parseInt(form.querySelector('input[name="quantity"]')?.value || 1),
              },
            ],
          });
        }
      });
    });
  }

  // ── Initialize All Modules ──────────────────────────────────────────────────
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    trackAddToCart(); // bind GA4 handler before the AJAX interceptor calls preventDefault
    initCartDrawer();
    initMobileMenu();
    initSearch();
    initProductGallery();
    initQuantitySelector();
    initNewsletterForm();
    initSmoothScroll();

    console.log('DLS-Belle1 Theme initialized');
  }

  init();
})();
