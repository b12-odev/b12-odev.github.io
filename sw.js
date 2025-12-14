// 1. OneSignal servis worker altyapısını içeri aktar
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 2. PWA yükleme gereksinimini karşıla ama hiçbir şeyi önbelleğe alma
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Beklemeden yeni sürümü aktif et
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Kontrolü hemen ele al
});

// 3. Sıfır Önbellek (Her isteği doğrudan internetten çek)
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
