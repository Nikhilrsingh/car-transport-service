const CACHE_NAME = 'harihar-pwa-cache-v8';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './assets/icons/icon.png',
    './css/styles.css',
    './css/light-mode.css',
    './js/script.js',
    './pages/Feedback.html',
    './pages/Terms%20of%20Services.html',
    './pages/about.html',
    './pages/blog-post.html',
    './pages/blog.html',
    './pages/booking.html',
    './pages/careers.html',
    './pages/city.html',
    './pages/contact.html',
    './pages/contributors.html',
    './pages/dashboard.html',
    './pages/emergency-support.html',
    './pages/enquiry.html',
    './pages/explore-cities.html',
    './pages/faq.html',
    './pages/gallery.html',
    './pages/how-it-works.html',
    './pages/invoice.html',
    './pages/login.html',
    './pages/our-network.html',
    './pages/press-media.html',
    './pages/pricing-calculator.html',
    './pages/pricing.html',
    './pages/privacy-policy.html',
    './pages/route-weather.html',
    './pages/sitemap.html',
    './pages/tracking.html',
    './pages/vehicle-inspection.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache and caching all pages');
            // Adding assets individually to prevent one failure from stopping the caching of valid resources
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url => cache.add(url).catch(err => console.error('Failed to cache', url, err)))
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        }).then(() => {
            console.log('🧹 Old caches purged, taking control immediately...');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    const isNavigation = event.request.mode === 'navigate';
    const isAsset = url.pathname.endsWith('.html') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js');

    // Use Network-First strategy for pages, styles, and scripts to avoid cache-stale issues
    if (isNavigation || isAsset) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    console.log('📶 Offline: Serving from Cache for', event.request.url);
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        if (isNavigation) {
                            return caches.match('./index.html');
                        }
                    });
                })
        );
        return;
    }

    // Default Cache-First / Stale-While-Revalidate for images and other media assets
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Fetch in background to update cache (stale-while-revalidate)
                fetch(event.request).then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));
                    }
                }).catch(() => { });
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});
