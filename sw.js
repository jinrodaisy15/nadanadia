export {};
// Replaced by the Vite build plugin; DOM types are deliberately excluded here.
const PRECACHE = [
	"assets/Gallery-B93zUTyJ.js",
	"assets/LoveLetter-CGc0VS8N.js",
	"assets/MusicPlayer-BdBCUgDS.js",
	"assets/index-BGICqLXk.css",
	"assets/index-Wfotasb0.js",
	"assets/rolldown-runtime-Bh1tDfsg.js",
	"assets/useIntersectionObserver-CDIbUof0.js",
	"assets/vendor-CnQ8cts2.js",
	"icons/icon-192.png",
	"icons/icon-512.png",
	"index.html",
	"manifest.json"
];
const CACHE_PREFIX = `nn-${encodeURIComponent(new URL(self.registration.scope).pathname)}-`;
const CACHE_NAME = `${CACHE_PREFIX}b9c5510aefc96f4c`;
const scopedUrl = (path) => new URL(path, self.registration.scope).href;
self.addEventListener("install", (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		await cache.addAll(PRECACHE.map(scopedUrl));
		await self.skipWaiting();
	})());
});
self.addEventListener("activate", (event) => {
	event.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key)));
		await self.clients.claim();
	})());
});
async function save(request, response) {
	if (!response.ok || response.status === 206) return;
	try {
		const cache = await caches.open(CACHE_NAME);
		await cache.put(request, response);
	} catch {}
}
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (request.method !== "GET" || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
	// Media range requests must reach the server; development modules must never be cached.
	if (request.headers.has("range") || request.destination === "audio" || request.destination === "video" || /\/(?:src|node_modules|@vite|@react-refresh)(?:\/|$)/.test(url.pathname)) return;
	event.respondWith((async () => {
		const cache = await caches.open(CACHE_NAME).catch(() => null);
		if (request.mode === "navigate") {
			try {
				const response = await fetch(request);
				if (response.ok) {
					event.waitUntil(save(request, response.clone()));
					return response;
				}
				return await cache?.match(request) ?? await cache?.match(scopedUrl("index.html")) ?? response;
			} catch {
				return await cache?.match(request) ?? await cache?.match(scopedUrl("index.html")) ?? Response.error();
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
