/**
 * DLS-Belle1 Shopify Liquid Theme - Main Script
 * Handles cart interactions, form submissions, and dynamic behaviors
 */

(function() {
  'use strict';

  // ── Theme Configuration ─────────────────────────────────────────────────────
  const config = {
    selectors: {
      cartToggle: '#cart-toggle',
      cartDrawer: '#cart-drawer',
      mobileMenuBtn: '#mobile-menu-btn',
      navMenu: '.nav-menu',
      quantityInput: 'input[name="quantity"]',
      variantSelect: '#variant-select',
    },
  };

  // ── Cart Drawer ─────────────────────────────────────────────────────────────
  function initCartDrawer() {
    const cartToggle = document.querySelector(config.selectors.cartToggle);
    const cartDrawer = document.querySelector(config.selectors.cartDrawer);

    if (!cartToggle || !cartDrawer) return;

    // Open cart drawer
    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    // Close cart drawer (click outside or close button)
    document.addEventListener('click', (e) => {
      if (
        cartDrawer.classList.contains('open') &&
        !cartDrawer.contains(e.target) &&
        !cartToggle.contains(e.target)
      ) {
        cartDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartDrawer.classList.contains('open')) {
        cartDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Mobile Menu ─────────────────────────────────────────────────────────────
  function initMobileMenu() {
    const mobileMenuBtn = document.querySelector(config.selectors.mobileMenuBtn);
    const navMenu = document.querySelector(config.selectors.navMenu);

    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navMenu.classList.toggle('hidden');
      navMenu.style.display = navMenu.classList.contains('hidden') ? 'none' : 'flex';
    });

    // Close menu when link is clicked
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.add('hidden');
        navMenu.style.display = 'none';
      });
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
          // Convert thumbnail URL to full-size URL
          const fullSizeUrl = img.src.replace('_100x100', '_800x800');
          mainImage.src = fullSizeUrl;

          // Update active state
          thumbnails.forEach((t) => t.style.borderColor = 'transparent');
          thumbnail.style.borderColor = 'var(--gold-400)';
        }
      });
    });
  }

  // ── Product Page: Quantity Selector ─────────────────────────────────────────
  function initQuantitySelector() {
    const quantityInputs = document.querySelectorAll('input[name="quantity"]');

    quantityInputs.forEach((input) => {
      // Prevent non-numeric input
      input.addEventListener('input', (e) => {
        e.target.value = Math.max(1, parseInt(e.target.value) || 1);
      });
    });
  }

  // ── Product Page: Variant Selection ─────────────────────────────────────────
  function initVariantSelector() {
    const variantSelect = document.querySelector(config.selectors.variantSelect);

    if (!variantSelect) return;

    variantSelect.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      // Could update price display here dynamically
      console.log('Variant selected:', selectedOption.text);
    });
  }

  // ── Cart Page: Form Submission ──────────────────────────────────────────────
  function initCartForm() {
    const cartForm = document.getElementById('cart-form');

    if (!cartForm) return;

    // Prevent multiple submissions
    cartForm.addEventListener('submit', (e) => {
      const submitBtn = cartForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';
      }
    });
  }

  // ── Newsletter Form ─────────────────────────────────────────────────────────
  function initNewsletterForm() {
    const newsletterForm = document.querySelector('form[action*="newsletter"]');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
      const email = newsletterForm.querySelector('input[type="email"]');

      // Basic email validation
      if (!email || !email.value.includes('@')) {
        e.preventDefault();
        alert('Please enter a valid email address.');
        return;
      }

      // Show success message
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

  // ── Lazy Image Loading ──────────────────────────────────────────────────────
  function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  // ── GA4 Event: Add to Cart ──────────────────────────────────────────────────
  function trackAddToCart() {
    const forms = document.querySelectorAll('form[action*="cart/add"]');

    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        // Send GA4 event
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
                quantity: parseInt(
                  form.querySelector('input[name="quantity"]')?.value || 1
                ),
              },
            ],
          });
        }
      });
    });
  }

  // ── GA4 Event: Begin Checkout ───────────────────────────────────────────────
  function trackBeginCheckout() {
    const checkoutBtn = document.querySelector('button[type="submit"][class*="checkout"]');

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'begin_checkout', {
            currency: 'USD',
          });
        }
      });
    }
  }

  // ── Initialize All Modules ──────────────────────────────────────────────────
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all components
    initCartDrawer();
    initMobileMenu();
    initProductGallery();
    initQuantitySelector();
    initVariantSelector();
    initCartForm();
    initNewsletterForm();
    initSmoothScroll();
    initLazyImages();
    trackAddToCart();
    trackBeginCheckout();

    console.log('DLS-Belle1 Theme initialized');
  }

  // Start initialization
  init();
})();
