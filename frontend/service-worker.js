const CACHE_NAME = 'harihar-pwa-cache-v3';
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
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Option to fetch in background to keep cache fresh (stale-while-revalidate)
                fetch(event.request).then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response));
                    }
                }).catch(() => { });
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Dynamically cache other resources like JS, CSS, images when visited
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                if (event.request.headers.get('accept').includes('text/html')) {
                    // Fallback to index if a page isn't available
                    return caches.match('./index.html');
                }
            });
        })
    );
});
