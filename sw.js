const CACHE_NAME = '9b-odev-cache-v3';
// Önbelleğe alınacak temel dosyalar:
const urlsToCache = [
  '/', // Ana sayfayı temsil eder
  'index.html', // Ana HTML dosyası
  'logo.png', // Logo
  'icon-192.png', // Manifest ikonu
  'icon-512.png', // Manifest ikonu
];

// 1. Install (Yükleme) olayı: Önbelleği aç ve dosyaları ekle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbellek açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch (Veri Çekme) olayı: Önce önbelleğe bak
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Eğer dosya önbellekte varsa, oradan döndür
        if (response) {
          return response;
        }
        // Önbellekte yoksa, internetten çek
        return fetch(event.request);
      }
    )
  );
});

// =======================================================
// PUSH BİLDİRİM KISMI BAŞLANGIÇ
// =======================================================

// 3. Push Olayı: Sunucudan bildirim geldiğinde çalışır
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Bildirimi Geldi.');

    let data = { 
        title: 'Yeni Ödev!', 
        body: 'Yeni bir ödev eklendi, hemen kontrol et!',
        icon: '/icon-192.png' // Manifestte kullandığınız ikon
    };

    // Sunucudan veri geliyorsa, o veriyi kullan
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
        badge: '/icon-192.png' // Android'de ikonun yanındaki küçük işaret için
    };

    // Bildirimin gösterilmesini bekler
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 4. Notification Click Olayı: Kullanıcı bildirime tıkladığında çalışır
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Bildirime Tıklandı.');
    
    event.notification.close(); // Bildirimi kapat
    
    // Tıklandığında ana sayfayı veya ilgili sayfayı aç
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then(windowClients => {
                const urlToOpen = '/'; // Tıklanınca açılacak sayfa

                // Zaten açık olan bir uygulama penceresi varsa, onu öne getir
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Açık pencere yoksa, yeni bir pencere aç
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// =======================================================
// PUSH BİLDİRİM KISMI SON
// =======================================================
