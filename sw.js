// sw.js - Background Service Worker for Lock Screen Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for background trigger from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_SESSION_NOTIFICATION') {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: icon || 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      vibrate: [500, 250, 500, 250, 500],
      tag: 'study-timer-complete',
      renotify: true,
      requireInteraction: true // Lock screen par notification tiki rahegi jab tak user interact na kare
    });
  }
});

// Notification click par app open karna
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
