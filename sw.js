// Yeni Service Worker (sw.js) - Sadece Bildirimler İçin
self.addEventListener('install', event => {
    // Kurulum olayını pas geç, önbellekleme yok.
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    // Tüm ağ isteklerini doğrudan internete yönlendir. Önbelleğe bakma.
    return fetch(event.request); 
});

// =======================================================
// PUSH BİLDİRİM KISMI (Mevcut kodunuzdaki gibi kalabilir)
// =======================================================

// 3. Push Olayı: Sunucudan bildirim geldiğinde çalışır
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Bildirimi Geldi.');

    let data = { 
        title: 'Yeni Ödev!', 
        body: 'Yeni bir ödev eklendi, hemen kontrol et!',
        icon: '/icon-192.png'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }
    
    const title = data.title;
    
    const options = {
        body: data.body,
        icon: data.icon,
        badge: '/icon-192.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 4. Notification Click Olayı: Kullanıcı bildirime tıkladığında çalışır
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Bildirime Tıklandı.');
    
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(windowClients => {
                const urlToOpen = '/';
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
