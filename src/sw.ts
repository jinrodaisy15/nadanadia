export {};
declare const self: ServiceWorkerGlobalScope;

// Replaced by the Vite build plugin; DOM types are deliberately excluded here.
const PRECACHE: readonly string[] = JSON.parse("__PRECACHE_ASSETS__");
const CACHE_PREFIX = `nn-${encodeURIComponent(new URL(self.registration.scope).pathname)}-`;
const CACHE_NAME = `${CACHE_PREFIX}__BUILD_VERSION__`;
const scopedUrl = (path: string) => new URL(path, self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE.map(scopedUrl));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function save(request: Request, response: Response): Promise<void> {
  if (!response.ok || response.status === 206) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
  } catch {
    // Storage may be full or disabled; keep serving the network response.
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  // Media range requests must reach the server; development modules must never be cached.
  if (request.headers.has('range') || request.destination === 'audio' || request.destination === 'video' ||
      /\/(?:src|node_modules|@vite|@react-refresh)(?:\/|$)/.test(url.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME).catch(() => null);
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) {
          event.waitUntil(save(request, response.clone()));
          return response;
        }
        return await cache?.match(request) ?? await cache?.match(scopedUrl('index.html')) ?? response;
      } catch {
        return await cache?.match(request) ?? await cache?.match(scopedUrl('index.html')) ?? Response.error();
      }
    }
    const cached = await cache?.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      event.waitUntil(save(request, response.clone()));
      return response;
    } catch {
      return Response.error();
    }
  })());
});
