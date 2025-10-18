const CACHE_NAME = '9b-odev-cache-v1';
// Önbelleğe alınacak temel dosyalar:
const urlsToCache = [
  '/', // Ana sayfayı temsil eder
  'index.html', // Ana HTML dosyası
  'logo.png', // Logo
  'icon-192.png', // Manifest ikonu
  'icon-512.png', // Manifest ikonu
  // Firebase ve Font dosyaları ağdan çekildiği için onları buraya eklemek 
  // biraz daha karmaşık. Şimdilik bu kadarı "Yükle" butonunu tetikler.
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
