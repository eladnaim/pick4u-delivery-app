const CACHE_NAME = 'pick4u-v1.0.3';
const STATIC_CACHE = 'pick4u-static-v1.0.3';
const DYNAMIC_CACHE = 'pick4u-dynamic-v1.0.3';

// Files to cache immediately
const STATIC_FILES = [
  // Avoid caching HTML shell to prevent stale deployments
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first for navigation/doc requests to ensure latest deployment
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request).then((response) => {
        // Optionally update cache with fresh HTML for offline fallback
        const copy = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put('/index.html', copy));
        return response;
      }).catch(async () => {
        // Fallback to cached shell if offline
        const cached = await caches.match('/index.html');
        return cached || Response.error();
      })
    );
    return;
  }

  // Cache-first for same-origin static assets; dynamically cache successful responses
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseToCache));
        return networkResponse;
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'pickup-request') {
    event.waitUntil(syncPickupRequests());
  }
});

// Push notifications (fallback for non-FCM pushes)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'בקשת איסוף חדשה באזור שלך!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/?tab=collect'
    },
    actions: [
      {
        action: 'view',
        title: 'צפה בבקשה',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'התעלם',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Pick4U - בקשה חדשה', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Helper functions
async function syncPickupRequests() {
  try {
    // Sync offline pickup requests when back online
    console.log('[SW] Syncing pickup requests...');
    // Implementation would sync with your backend API
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Update notification
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Ensure immediate control after activation
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// --- Firebase Cloud Messaging integration into this SW ---
try {
  importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

  const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "pick4u-demo.firebaseapp.com",
    projectId: "pick4u-demo",
    storageBucket: "pick4u-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  };

  // Guard initialize in case the SDK is already initialized
  if (!self.firebase?.apps?.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const fcmMessaging = firebase.messaging();

  // FCM background handler
  fcmMessaging.onBackgroundMessage((payload) => {
    console.log('[SW][FCM] Background message:', payload);

    const notificationTitle = payload.notification?.title || 'הודעה חדשה';
    const notificationOptions = {
      body: payload.notification?.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: payload.data?.type || 'default',
      data: payload.data,
      actions: [
        { action: 'open', title: 'פתח', icon: '/icons/icon-192x192.png' },
        { action: 'close', title: 'סגור' }
      ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // Delegate notification clicks for FCM as well
  self.addEventListener('notificationclick', (event) => {
    if (event.action === 'close') return;
    const urlToOpen = event.notification?.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });
} catch (e) {
  // If FCM scripts fail to load, continue with basic SW features
  console.warn('[SW] FCM integration not available:', e);
}