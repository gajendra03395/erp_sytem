self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('dongkwang-erp-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/analytics',
        '/inventory',
        '/production',
        '/financial-management',
        '/chat',
        '/employees',
        '/reports',
        '/quality-control',
        '/machines',
        '/attendance',
        '/export',
        '/import',
        '/automation',
        '/notifications',
        '/manifest.json',
        '/_next/static/css/app/layout.css',
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/main-app.js',
        '/_next/static/chunks/app/_layout-client.js',
        '/_next/static/chunks/app/(main)/layout.js',
        '/_next/static/chunks/app/(main)/dashboard/page.js',
        '/_next/static/chunks/app/auth/login/page.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'dongkwang-erp-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
