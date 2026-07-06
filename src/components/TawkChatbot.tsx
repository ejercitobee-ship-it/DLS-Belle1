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
    // Use environment variable or fallback to hard-coded ID (same as local dev)
    const tawkId = import.meta.env.VITE_TAWK_ID || '69fb527d491d631c393ede51';
    if (!tawkId) return; // Don't load if ID is not configured

    // Initialize Tawk.to widget
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];

    s1.async = true;
    s1.src = `https://embed.tawk.to/${tawkId}/1jnurkehu`;
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
