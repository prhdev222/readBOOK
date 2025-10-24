'use client';

import { useEffect } from 'react';
import { 
  registerServiceWorker, 
  enablePWAInstall, 
  checkServiceWorkerUpdate,
  checkPWAUpdate 
} from '@/lib/pwa';

interface PWAProviderProps {
  children: React.ReactNode;
}

export default function PWAProvider({ children }: PWAProviderProps) {
  useEffect(() => {
    // ลงทะเบียน Service Worker
    registerServiceWorker();

    // เปิดใช้งาน PWA Install Prompt
    enablePWAInstall();

    // ตรวจสอบการอัปเดต Service Worker
    checkServiceWorkerUpdate();

    // ตรวจสอบการอัปเดต PWA
    checkPWAUpdate();
  }, []);

  return <>{children}</>;
}
