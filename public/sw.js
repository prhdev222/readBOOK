// Service Worker สำหรับ readBOOK PWA
const CACHE_NAME = 'readbook-v1';
const OFFLINE_URL = '/offline';

// ไฟล์ที่ต้อง cache
const urlsToCache = [
  '/',
  '/books',
  '/search',
  '/categories',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// ติดตั้ง Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// เปิดใช้งาน Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// จัดการ fetch requests
self.addEventListener('fetch', (event) => {
  // ตรวจสอบว่าเป็น navigation request หรือไม่
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          // ถ้าไม่มี internet ให้แสดงหน้า offline
          return caches.match(OFFLINE_URL);
        })
    );
  }
  
  // จัดการ API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // ถ้าไม่มี internet ให้ใช้ cached data
          return caches.match(event.request);
        })
    );
  }
  
  // จัดการ static assets
  if (event.request.destination === 'image' || 
      event.request.destination === 'script' || 
      event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              // Cache new assets
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            });
        })
    );
  }
});

// จัดการ background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync');
    event.waitUntil(
      // Sync offline data when online
      syncOfflineData()
    );
  }
});

// ฟังก์ชัน sync ข้อมูล offline
async function syncOfflineData() {
  try {
    // ดึงข้อมูลจาก IndexedDB
    const offlineData = await getOfflineData();
    
    if (offlineData && offlineData.length > 0) {
      // ส่งข้อมูลไปยัง server
      for (const data of offlineData) {
        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
      }
      
      // ลบข้อมูลที่ sync แล้ว
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// ฟังก์ชันดึงข้อมูลจาก IndexedDB
async function getOfflineData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('readbook-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readonly');
      const store = transaction.objectStore('offline-data');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

// ฟังก์ชันลบข้อมูลจาก IndexedDB
async function clearOfflineData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('readbook-offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline-data'], 'readwrite');
      const store = transaction.objectStore('offline-data');
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    };
  });
}

// จัดการ push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'มีหนังสือใหม่!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'ดูหนังสือ',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'ปิด',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('readBOOK', options)
  );
});

// จัดการ notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/books')
    );
  } else if (event.action === 'close') {
    // ปิด notification
  } else {
    // เปิดหน้าแรก
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
