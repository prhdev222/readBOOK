'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateLineLoginUrl } from '@/lib/line-auth';

export default function LineLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบ session จาก URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const lineSession = urlParams.get('line_session');
    
    if (lineSession) {
      try {
        const sessionData = JSON.parse(atob(lineSession));
        // บันทึก session ลง localStorage
        localStorage.setItem('line_session', JSON.stringify(sessionData));
        // ลบ parameter จาก URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // redirect ไปหน้าหลัก
        router.push('/');
      } catch (error) {
        console.error('Error parsing line session:', error);
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    }
  }, [router]);

  const handleLineLogin = () => {
    setLoading(true);
    setError('');
    
    try {
      // ตรวจสอบว่า Line config พร้อมใช้งานหรือไม่
      if (!process.env.NEXT_PUBLIC_LINE_CHANNEL_ID) {
        setError('Line Login ยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ');
        setLoading(false);
        return;
      }
      
      const lineLoginUrl = generateLineLoginUrl();
      window.location.href = lineLoginUrl;
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            📚 readBOOK
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            เข้าสู่ระบบด้วย Line
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            เข้าสู่ระบบด้วยบัญชี Line ของคุณ
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {!process.env.NEXT_PUBLIC_LINE_CHANNEL_ID && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              <p className="font-medium">Line Login ยังไม่ได้ตั้งค่า</p>
              <p className="text-sm mt-1">
                กรุณาติดต่อผู้ดูแลระบบเพื่อตั้งค่า Line Login
              </p>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleLineLogin}
              disabled={loading || !process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#00B900">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386a.63.63 0 01-.63-.63v-3.75c0-.345.281-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .345-.279.63-.63.63a.63.63 0 01-.63-.63V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .345-.282.63-.63.63a.63.63 0 01-.63-.63V8.108c0-.345.285-.63.63-.63.345 0 .63.285.63.63v4.771zm-2.466.63H4.917a.63.63 0 01-.63-.63V8.108c0-.345.285-.63.63-.63.345 0 .63.285.63.63v4.771c0 .345-.285.63-.63.63z"/>
                  </svg>
                  เข้าสู่ระบบด้วย Line
                </div>
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">หรือ</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ต้องการใช้ Google?{' '}
                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  เข้าสู่ระบบด้วย Google
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <Link href="/" className="font-medium text-green-600 hover:text-green-500">
                  ← กลับไปหน้าหลัก
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
