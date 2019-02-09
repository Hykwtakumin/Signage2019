self.addEventListener("install", event => {
    console.info("install", event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    console.info("activate", event);
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    console.info("fetch", event);
});
