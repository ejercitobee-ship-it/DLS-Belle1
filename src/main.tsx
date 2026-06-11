import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// After a deploy, lazy-loaded chunks from the previous build no longer exist,
// so stale tabs fail with "Failed to fetch dynamically imported module".
// Reload once to pick up the new build instead of showing the error screen.
window.addEventListener('vite:preloadError', (event) => {
  const key = 'chunk-reload-at';
  const last = Number(sessionStorage.getItem(key) || 0);
  if (Date.now() - last > 10_000) {
    sessionStorage.setItem(key, String(Date.now()));
    event.preventDefault();
    window.location.reload();
  }
});

const rootElement = document.getElementById('root')!;

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, (
    <StrictMode>
      <App />
    </StrictMode>
  ));
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
