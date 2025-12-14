// 1. OneSignal'ın tüm bildirim ve altyapı kodunu içeri aktar.
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// 2. Kendi PWA kaydınızı korumak için gerekli olan basit bir install/fetch bırakılabilir.
// Aslında bu kodlar sadece dosyanın varlığını kanıtlamak içindir.
// OneSignal'ı import ettiğiniz için, bildirim işleri artık onun kontrolündedir.

self.addEventListener('install', event => {
    // Kurulum olayını pas geç. Bu dosyanın varlığı PWA için yeterlidir.
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    // Ağa git, hiçbir şeyi önbelleğe alma (sizin isteğiniz).
    return fetch(event.request); 
});
