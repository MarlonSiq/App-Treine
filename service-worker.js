self.addEventListener("install", e => {
  console.log("Service Worker instalado.");
});

self.addEventListener("fetch", e => {
  // permite interceptar requests futuramente (cache, offline, etc.)
});