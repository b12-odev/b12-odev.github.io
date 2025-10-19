/*
  SÜRÜM KONTROLÜ:
  index.html veya logo.png gibi ana dosyalarda BÜYÜK bir değişiklik yaptığında,
  aşağıdaki CACHE_NAME'i 'dokuzb-cache-v3', 'dokuzb-cache-v4' vb. olarak değiştir.
*/
const CACHE_NAME = 'dokuzb-cache-v2';

// Uygulamanın çalışması için ZORUNLU olan dosyalar
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'logo.png'
  // CSS ve JS dosyaların zaten HTML içindeydi,
  // eğer harici dosya eklersen buraya ekle (örn: 'style.css')
];

// 1. YÜKLEME (INSTALL)
// Service Worker yüklendiğinde çalışır
self.addEventListener('install', (event) => {
  console.log('SW: Yükleniyor...');
  
  // Zorunlu dosyaları önbelleğe al
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Zorunlu dosyalar önbelleğe alınıyor:', ASSETS_TO_CACHE);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // Yeni Service Worker'ı beklemeden hemen aktifleştir
        console.log('SW: Yüklendi, skipWaiting() çağrıldı.');
        return self.skipWaiting();
      })
  );
});

// 2. AKTİFLEŞTİRME (ACTIVATE)
// Service Worker aktifleştirildiğinde (skipWaiting sayesinde hemen) çalışır
self.addEventListener('activate', (event) => {
  console.log('SW: Aktifleşiyor...');
  
  // Eski önbellekleri temizle
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eğer bu cache, şu anki cache değilse (yani eskiyse) sil
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Eski önbellek siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Aktif olan SW'yi tüm açık sayfalarda anında etkinleştir
      console.log('SW: Aktifleşti, clients.claim() çağrıldı.');
      return self.clients.claim();
    })
  );
});

// 3. İSTEK (FETCH)
// Sayfadan yapılan her türlü (resim, css, js, sayfa) istekte çalışır
self.addEventListener('fetch', (event) => {

  // Strateji: Navigasyon istekleri (sayfanın kendisi, yani index.html)
  if (event.request.mode === 'navigate') {
    // ÖNCE AĞ (NETWORK), SONRA ÖNBELLEK (CACHE)
    event.respondWith(
      fetch(event.request) // Önce internetten almayı dene
        .then((response) => {
          // Başarılıysa, bir kopyasını önbelleğe at ve sayfaya gönder
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // İnternet yoksa veya hata olursa önbellekten ver (çevrimdışı çalışma)
          console.log('SW: Navigasyon hatası, önbellekten veriliyor:', event.request.url);
          return caches.match(event.request.url, { ignoreSearch: true })
                       .then(response => response || caches.match('/'));
        })
    );
    return; // Navigasyon isteğini bitir
  }

  // Strateji: Diğer tüm istekler (Firebase JS, Google Font, resimler vb.)
  // ÖNCE ÖNBELLEK (CACHE), SONRA AĞ (NETWORK)
  event.respondWith(
    caches.match(event.request) // Önce önbellekte var mı diye bak
      .then((response) => {
        if (response) {
          // Varsa hemen önbellekten ver (çok hızlı)
          return response;
        }
        
        // Yoksa internetten al
        return fetch(event.request)
          .then((response) => {
            // Aldığını bir kopyasını (ileride kullanmak için) önbelleğe de at
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            // İsteği sayfaya gönder
            return response;
          })
          .catch(err => {
             // Hata olursa (örn: firebase yüklenemezse) boşver
             console.error('SW: Fetch hatası:', err);
          });
      })
  );
});
