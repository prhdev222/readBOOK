'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  isOnline, 
  getOfflineFiles, 
  deleteOfflineFile, 
  getStorageUsage,
  isPWAInstalled 
} from '@/lib/pwa';

export default function OfflinePage() {
  const [online, setOnline] = useState(true);
  const [offlineFiles, setOfflineFiles] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState({ used: 0, quota: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบสถานะการเชื่อมต่อ
    setOnline(isOnline());

    // ตรวจสอบการเปลี่ยนแปลงสถานะการเชื่อมต่อ
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // โหลดข้อมูล offline
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = async () => {
    try {
      const files = await getOfflineFiles();
      const usage = await getStorageUsage();
      
      setOfflineFiles(files);
      setStorageUsage(usage);
    } catch (error) {
      console.error('Error loading offline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบไฟล์ ${filename}?`)) {
      const success = await deleteOfflineFile(filename);
      if (success) {
        await loadOfflineData();
      }
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 readBOOK</h1>
              <div className="ml-4 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {online ? 'ออนไลน์' : 'ออฟไลน์'}
                </span>
              </div>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              กลับไปหน้าหลัก
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            สถานะการเชื่อมต่อ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                online ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-2xl">
                  {online ? '🌐' : '📵'}
                </span>
              </div>
              <h3 className="font-medium text-gray-900">
                {online ? 'เชื่อมต่ออินเทอร์เน็ต' : 'ไม่มีอินเทอร์เน็ต'}
              </h3>
              <p className="text-sm text-gray-600">
                {online ? 'สามารถเข้าถึงหนังสือออนไลน์ได้' : 'อ่านหนังสือที่ดาวน์โหลดแล้วเท่านั้น'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center bg-blue-100">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-medium text-gray-900">
                PWA Status
              </h3>
              <p className="text-sm text-gray-600">
                {isPWAInstalled() ? 'ติดตั้งแล้ว' : 'ยังไม่ได้ติดตั้ง'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center bg-purple-100">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="font-medium text-gray-900">
                Storage Usage
              </h3>
              <p className="text-sm text-gray-600">
                {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.quota)}
              </p>
            </div>
          </div>
        </div>

        {/* Offline Files */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              ไฟล์ที่ดาวน์โหลดแล้ว
            </h2>
            <span className="text-sm text-gray-600">
              {offlineFiles.length} ไฟล์
            </span>
          </div>

          {offlineFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยังไม่มีไฟล์ที่ดาวน์โหลดแล้ว
              </h3>
              <p className="text-gray-600 mb-6">
                ดาวน์โหลดหนังสือเพื่ออ่านออฟไลน์
              </p>
              <Link
                href="/books"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ดูหนังสือทั้งหมด
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {offlineFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {file.filename}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        URL: {file.url}
                      </p>
                      <p className="text-sm text-gray-500">
                        ดาวน์โหลดเมื่อ: {formatDate(file.timestamp)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // เปิดไฟล์ที่ดาวน์โหลดแล้ว
                          const blob = new Blob([file.data]);
                          const url = URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        เปิด
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.filename)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📖 วิธีใช้งานออฟไลน์
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• ดาวน์โหลดหนังสือที่ต้องการอ่านออฟไลน์</li>
            <li>• ไฟล์จะถูกบันทึกในอุปกรณ์ของคุณ</li>
            <li>• สามารถอ่านได้แม้ไม่มีอินเทอร์เน็ต</li>
            <li>• ใช้พื้นที่เก็บข้อมูลในอุปกรณ์</li>
            <li>• สามารถลบไฟล์ที่ไม่ต้องการได้</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
