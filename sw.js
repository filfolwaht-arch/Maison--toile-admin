/* ==============================================================
   VELORA JEWELRY — Service Worker (Web Push notifications)
   ============================================================== */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'طلب جديد!', body: 'لديك طلب جديد في المتجر' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) { /* keep default */ }

  const options = {
    body: data.body,
    icon: 'assets/icons/favicon.png',
    badge: 'assets/icons/favicon.png',
    data: { order_number: data.order_number || null },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('admin.html') && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('admin.html');
    })
  );
});
