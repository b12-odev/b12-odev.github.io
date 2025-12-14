// sw.js içeriği BAŞLANGIÇ

// 1. OneSignal'ı İçeri Aktar (Bu satır çok önemlidir)
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 2. Tarayıcıya eski SW'nin yerine hemen geçmesini söyle
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 3. PWA önbelleklemesini devre dışı bırak (Ödev listesi güncel kalsın diye)
self.addEventListener('fetch', (event) => {
    // Tüm istekleri internetten çek, önbellek kullanma
    event.respondWith(fetch(event.request));
});

// sw.js içeriği SONU
