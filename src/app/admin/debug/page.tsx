'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnvironment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-google-drive-simple');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: 'Failed to fetch debug info' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              📚 readBOOK Debug
            </Link>
            <nav className="flex space-x-8">
              <Link href="/admin/books" className="text-gray-600 hover:text-gray-900">
                จัดการหนังสือ
              </Link>
              <Link href="/admin/test-connection" className="text-gray-600 hover:text-gray-900">
                ทดสอบการเชื่อมต่อ
              </Link>
              <Link href="/admin/debug" className="text-blue-600 font-medium">
                Debug
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Environment Variables</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">ตรวจสอบ Google Drive Credentials</h2>
          <button
            onClick={checkEnvironment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '🔄 กำลังตรวจสอบ...' : '🔍 ตรวจสอบ Environment Variables'}
          </button>
        </div>

        {debugInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ผลการตรวจสอบ</h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                debugInfo.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className="font-medium mb-2">
                  {debugInfo.success ? '✅ ตั้งค่าถูกต้อง' : '❌ ตั้งค่าผิดพลาด'}
                </h3>
                <p className="text-sm mb-2">{debugInfo.message}</p>
                
                {debugInfo.data && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <strong>Client Email:</strong> {debugInfo.data.clientEmail}
                    </div>
                    <div className="text-sm">
                      <strong>Folder ID:</strong> {debugInfo.data.folderId}
                    </div>
                    <div className="text-sm">
                      <strong>Private Key:</strong> {debugInfo.data.hasPrivateKey ? '✅ มี' : '❌ ไม่มี'}
                    </div>
                    <div className="text-sm">
                      <strong>Private Key Length:</strong> {debugInfo.data.privateKeyLength} characters
                    </div>
                    {debugInfo.data.privateKeyStart && (
                      <div className="text-sm">
                        <strong>Private Key Start:</strong> {debugInfo.data.privateKeyStart}
                      </div>
                    )}
                    {debugInfo.data.privateKeyEnd && (
                      <div className="text-sm">
                        <strong>Private Key End:</strong> {debugInfo.data.privateKeyEnd}
                      </div>
                    )}
                  </div>
                )}

                {debugInfo.missing && (
                  <div className="mt-4">
                    <h4 className="font-medium text-red-800 mb-2">ข้อมูลที่ขาดหายไป:</h4>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {debugInfo.missing.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {debugInfo.current && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">สถานะปัจจุบัน:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className={`p-2 rounded ${debugInfo.current.clientEmail ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        CLIENT_EMAIL: {debugInfo.current.clientEmail ? '✅' : '❌'}
                      </div>
                      <div className={`p-2 rounded ${debugInfo.current.privateKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        PRIVATE_KEY: {debugInfo.current.privateKey ? '✅' : '❌'}
                      </div>
                      <div className={`p-2 rounded ${debugInfo.current.folderId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        FOLDER_ID: {debugInfo.current.folderId ? '✅' : '❌'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">วิธีแก้ไขปัญหา</h2>
          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <h3 className="font-medium">1. ตรวจสอบไฟล์ .env.local:</h3>
              <ul className="list-disc list-inside ml-4">
                <li>ไฟล์ต้องอยู่ในโฟลเดอร์ digital-library</li>
                <li>ชื่อไฟล์ต้องเป็น .env.local (มีจุดหน้าชื่อ)</li>
                <li>ข้อมูลต้องถูกต้องและครบถ้วน</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">2. ตรวจสอบข้อมูลใน .env.local:</h3>
              <ul className="list-disc list-inside ml-4">
                <li>GOOGLE_DRIVE_CLIENT_EMAIL: ต้องเป็น email ของ Service Account</li>
                <li>GOOGLE_DRIVE_PRIVATE_KEY: ต้องมีเครื่องหมายคำพูดและ \n</li>
                <li>GOOGLE_DRIVE_DB_FOLDER_ID: ต้องเป็น Folder ID จริง</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">3. รีสตาร์ทเซิร์ฟเวอร์:</h3>
              <ul className="list-disc list-inside ml-4">
                <li>หยุดเซิร์ฟเวอร์ (Ctrl+C)</li>
                <li>เริ่มใหม่: npm run dev</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
