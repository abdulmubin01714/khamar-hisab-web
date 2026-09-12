const CACHE_NAME = 'khamar-hisab-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// শুধু নিজের সাইটের ফাইল ক্যাশ করে দ্রুত লোড ও অফলাইনে খোলার জন্য।
// Firebase/CDN রিকোয়েস্ট এখানে ছোঁয়া হয় না — সেগুলো সরাসরি ইন্টারনেট থেকেই যাবে।
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const fresh = await fetch(event.request);
        cache.put(event.request, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await cache.match(event.request);
        return cached || Promise.reject(err);
      }
    })
  );
});
