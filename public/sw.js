const CACHE_NAME = "v-design-studio-v1";
const urlsToCache = [
  "/",
  "/images/v-design-logo.png",
  "/images/about-background.jpg",
  "/images/contact-background.jpg",
  "/images/testimonials-background.jpg",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update from V Design Studio",
    icon: "/images/v-design-logo.png",
    badge: "/images/v-design-logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Portfolio",
        icon: "/images/v-design-logo.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/images/v-design-logo.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("V Design Studio", options)
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/#portfolio"));
  }
});
