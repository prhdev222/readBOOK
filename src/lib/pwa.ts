// PWA Utilities สำหรับ readBOOK

// ตรวจสอบว่า PWA พร้อมใช้งานหรือไม่
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// ตรวจสอบว่าเป็น mobile device หรือไม่
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ตรวจสอบว่าเป็น iOS หรือไม่
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// ตรวจสอบว่าเป็น Android หรือไม่
export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

// ตรวจสอบว่า Service Worker พร้อมใช้งานหรือไม่
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

// ตรวจสอบว่า IndexedDB พร้อมใช้งานหรือไม่
export function isIndexedDBSupported(): boolean {
  return 'indexedDB' in window;
}

// ตรวจสอบว่า Web App Manifest พร้อมใช้งานหรือไม่
export function isWebAppManifestSupported(): boolean {
  return 'onbeforeinstallprompt' in window;
}

// ตรวจสอบการเชื่อมต่อ internet
export function isOnline(): boolean {
  return navigator.onLine;
}

// ตรวจสอบการเชื่อมต่อ internet แบบ real-time
export function checkOnlineStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

// ลงทะเบียน Service Worker
export async function registerServiceWorker(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return true;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
}

// ตรวจสอบการอัปเดต Service Worker
export function checkServiceWorkerUpdate(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

// เปิดใช้งาน PWA Install Prompt
export function enablePWAInstall(): void {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // แสดงปุ่มติดตั้ง PWA
    const installButton = document.getElementById('install-pwa-button');
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`PWA install outcome: ${outcome}`);
          deferredPrompt = null;
        }
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    const installButton = document.getElementById('install-pwa-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  });
}

// บันทึกข้อมูลลง IndexedDB
export async function saveToIndexedDB(key: string, data: any): Promise<boolean> {
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported');
    return false;
  }

  try {
    const request = indexedDB.open('readbook-offline', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readwrite');
        const store = transaction.objectStore('offline-data');
        const putRequest = store.put(data, key);
        
        putRequest.onsuccess = () => resolve(true);
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('offline-data')) {
          db.createObjectStore('offline-data');
        }
      };
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    return false;
  }
}

// ดึงข้อมูลจาก IndexedDB
export async function getFromIndexedDB(key: string): Promise<any> {
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported');
    return null;
  }

  try {
    const request = indexedDB.open('readbook-offline', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readonly');
        const store = transaction.objectStore('offline-data');
        const getRequest = store.get(key);
        
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  } catch (error) {
    console.error('Error getting from IndexedDB:', error);
    return null;
  }
}

// ลบข้อมูลจาก IndexedDB
export async function deleteFromIndexedDB(key: string): Promise<boolean> {
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported');
    return false;
  }

  try {
    const request = indexedDB.open('readbook-offline', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readwrite');
        const store = transaction.objectStore('offline-data');
        const deleteRequest = store.delete(key);
        
        deleteRequest.onsuccess = () => resolve(true);
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  } catch (error) {
    console.error('Error deleting from IndexedDB:', error);
    return false;
  }
}

// ดาวน์โหลดไฟล์สำหรับ offline
export async function downloadForOffline(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    
    // บันทึกลง IndexedDB
    await saveToIndexedDB(`offline-file-${filename}`, {
      url,
      filename,
      data: arrayBuffer,
      timestamp: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error downloading file for offline:', error);
    return false;
  }
}

// ตรวจสอบไฟล์ที่ดาวน์โหลดแล้ว
export async function getOfflineFiles(): Promise<any[]> {
  try {
    const request = indexedDB.open('readbook-offline', 1);
    
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['offline-data'], 'readonly');
        const store = transaction.objectStore('offline-data');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          const files = getAllRequest.result.filter(item => 
            item && item.filename && item.data
          );
          resolve(files);
        };
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
    });
  } catch (error) {
    console.error('Error getting offline files:', error);
    return [];
  }
}

// ลบไฟล์ offline
export async function deleteOfflineFile(filename: string): Promise<boolean> {
  return await deleteFromIndexedDB(`offline-file-${filename}`);
}

// ตรวจสอบขนาด storage ที่ใช้
export async function getStorageUsage(): Promise<{ used: number; quota: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0
    };
  }
  
  return { used: 0, quota: 0 };
}

// ตรวจสอบการอัปเดต PWA
export function checkPWAUpdate(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATE') {
        // แสดงการแจ้งเตือนการอัปเดต
        if (confirm('มีเวอร์ชันใหม่ของ readBOOK ต้องการอัปเดตหรือไม่?')) {
          window.location.reload();
        }
      }
    });
  }
}
