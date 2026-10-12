import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Missing application root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker for PWA (ikuti base path build)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const register = () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { type: 'module' })
      .catch((err) => console.warn('[SW] Registration failed:', err));
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
} else if ('serviceWorker' in navigator) {
  // A production preview may have used this origin before the dev server.
  const workerUrl = new URL(`${import.meta.env.BASE_URL}sw.js`, window.location.href).href;
  navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(
    registrations.filter(registration =>
      [registration.active, registration.waiting, registration.installing].some(worker => worker?.scriptURL === workerUrl)
    ).map(registration => registration.unregister())
  )).catch(() => { /* Service workers can be unavailable in private browsing. */ });
}
