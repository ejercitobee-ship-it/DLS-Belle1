import { useEffect } from 'react';

// Declare Tawk API on window object
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget(): void;
    };
  }
}

export default function TawkChatbot() {
  useEffect(() => {
    // Initialize Tawk.to widget
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];

    s1.async = true;
    s1.src = 'https://embed.tawk.to/YOUR_TAWK_PROPERTY_ID/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }

    return () => {
      // Cleanup: hide widget if component unmounts
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  return null; // Tawk.to injects its own UI
}
