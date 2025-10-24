'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { googleDriveService } from '@/lib/google-drive';

export default function TestConnectionPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<'testing' | 'connected' | 'error' | null>(null);
  const [googleDriveStatus, setGoogleDriveStatus] = useState<'testing' | 'connected' | 'error' | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // ทดสอบ Supabase
  const testSupabase = async () => {
    setSupabaseStatus('testing');
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      
      if (data.success) {
        setSupabaseStatus('connected');
        setTestResults((prev: Record<string, any>) => ({ ...prev, supabase: data.data }));
      } else {
        setSupabaseStatus('error');
      }
    } catch (error) {
      console.error('Supabase test failed:', error);
      setSupabaseStatus('error');
    }
  };

  // ทดสอบ Google Drive
  const testGoogleDrive = async () => {
    setGoogleDriveStatus('testing');
    try {
      // ใช้ API endpoint แทนการเรียกใช้ library โดยตรง
      const response = await fetch('/api/test-google-drive-simple');
      const data = await response.json();
      
      if (data.success) {
        setGoogleDriveStatus('connected');
        setTestResults((prev: Record<string, any>) => ({ ...prev, googleDrive: 'Connected successfully' }));
      } else {
        setGoogleDriveStatus('error');
      }
    } catch (error) {
      console.error('Google Drive test failed:', error);
      setGoogleDriveStatus('error');
    }
  };

  // ทดสอบทั้งหมด
  const testAll = async () => {
    await testSupabase();
    await testGoogleDrive();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              📚 readBOOK Admin
            </Link>
            <nav className="flex space-x-8">
              <Link href="/admin/books" className="text-gray-600 hover:text-gray-900">
                จัดการหนังสือ
              </Link>
              <Link href="/admin/test-connection" className="text-blue-600 font-medium">
                ทดสอบการเชื่อมต่อ
              </Link>
              <Link href="/admin/statistics" className="text-gray-600 hover:text-gray-900">
                สถิติ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ทดสอบการเชื่อมต่อ</h1>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Supabase</h2>
            <p className="text-gray-600 mb-4">
              ทดสอบการเชื่อมต่อฐานข้อมูล Supabase
            </p>
            <button
              onClick={testSupabase}
              disabled={supabaseStatus === 'testing'}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                supabaseStatus === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : supabaseStatus === 'error'
                  ? 'bg-red-100 text-red-800'
                  : supabaseStatus === 'testing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {supabaseStatus === 'testing' && '🔄 กำลังทดสอบ...'}
              {supabaseStatus === 'connected' && '✅ เชื่อมต่อสำเร็จ'}
              {supabaseStatus === 'error' && '❌ เชื่อมต่อล้มเหลว'}
              {!supabaseStatus && 'ทดสอบ Supabase'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Google Drive</h2>
            <p className="text-gray-600 mb-4">
              ทดสอบการเชื่อมต่อ Google Drive API
            </p>
            <button
              onClick={testGoogleDrive}
              disabled={googleDriveStatus === 'testing'}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                googleDriveStatus === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : googleDriveStatus === 'error'
                  ? 'bg-red-100 text-red-800'
                  : googleDriveStatus === 'testing'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {googleDriveStatus === 'testing' && '🔄 กำลังทดสอบ...'}
              {googleDriveStatus === 'connected' && '✅ เชื่อมต่อสำเร็จ'}
              {googleDriveStatus === 'error' && '❌ เชื่อมต่อล้มเหลว'}
              {!googleDriveStatus && 'ทดสอบ Google Drive'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ทดสอบทั้งหมด</h2>
            <p className="text-gray-600 mb-4">
              ทดสอบการเชื่อมต่อทั้ง Supabase และ Google Drive
            </p>
            <button
              onClick={testAll}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              🚀 ทดสอบทั้งหมด
            </button>
          </div>
        </div>

        {/* Test Results */}
        {(supabaseStatus || googleDriveStatus) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ผลการทดสอบ</h2>
            
            {/* Supabase Results */}
            {supabaseStatus && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Supabase</h3>
                <div className={`p-4 rounded-lg ${
                  supabaseStatus === 'connected' ? 'bg-green-50 border border-green-200' :
                  supabaseStatus === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  {supabaseStatus === 'connected' && (
                    <div>
                      <p className="text-green-800 font-medium">✅ เชื่อมต่อสำเร็จ</p>
                      {testResults.supabase && (
                        <div className="mt-2 text-sm text-green-700">
                          <p>หนังสือทั้งหมด: {testResults.supabase.totalBooks}</p>
                          <p>ลิงก์ทั้งหมด: {testResults.supabase.totalLinks}</p>
                          <p>หมวดหมู่: {testResults.supabase.totalCategories}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {supabaseStatus === 'error' && (
                    <p className="text-red-800">❌ ไม่สามารถเชื่อมต่อได้ - ตรวจสอบ .env.local</p>
                  )}
                </div>
              </div>
            )}

            {/* Google Drive Results */}
            {googleDriveStatus && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Google Drive</h3>
                <div className={`p-4 rounded-lg ${
                  googleDriveStatus === 'connected' ? 'bg-green-50 border border-green-200' :
                  googleDriveStatus === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-yellow-50 border border-yellow-200'
                }`}>
                  {googleDriveStatus === 'connected' && (
                    <p className="text-green-800">✅ เชื่อมต่อสำเร็จ</p>
                  )}
                  {googleDriveStatus === 'error' && (
                    <div>
                      <p className="text-red-800">❌ ไม่สามารถเชื่อมต่อได้</p>
                      <p className="text-sm text-red-600 mt-1">
                        ตรวจสอบ Google Drive API credentials ใน .env.local
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Setup Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">คู่มือการตั้งค่า</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-blue-800">1. ตั้งค่า Supabase:</h3>
              <ul className="list-disc list-inside text-blue-700 ml-4">
                <li>สร้างบัญชีที่ <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a></li>
                <li>สร้างโปรเจคใหม่</li>
                <li>คัดลอก URL และ Anon Key</li>
                <li>ใส่ในไฟล์ .env.local</li>
                <li>รัน SQL migration ใน Supabase Dashboard</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-800">2. ตั้งค่า Google Drive:</h3>
              <ul className="list-disc list-inside text-blue-700 ml-4">
                <li>ไปที่ <a href="https://console.cloud.google.com" target="_blank" className="underline">Google Cloud Console</a></li>
                <li>สร้าง Service Account</li>
                <li>ดาวน์โหลด JSON key</li>
                <li>แชร์โฟลเดอร์ Google Drive กับ Service Account</li>
                <li>ใส่ credentials ใน .env.local</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
