// src/service-workers/ethereumx.ts

// Define the cache name
const CACHE_NAME = 'ethereumx-cache-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('EthereumX Service Worker installing...');
    // Perform install steps
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('EthereumX Service Worker activating...');
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    
    // Respond with cached data or fetch from network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Custom fetch handler for specific routes
self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/data')) {
        event.respondWith(
            new Response(JSON.stringify({ message: 'Hello from EthereumX Service Worker!' }), {
                headers: { 'Content-Type': 'application/json' }
            })
        );
    }
});
