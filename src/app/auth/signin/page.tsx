'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่
    getSession().then((session) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        setError('เกิดข้อผิดพลาดในการล็อกอิน');
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการล็อกอิน');
    } finally {
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
            เข้าสู่ระบบด้วย Google
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            เข้าสู่ระบบด้วยบัญชี Google ของคุณ
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

          {!process.env.GOOGLE_CLIENT_ID && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
              <p className="font-medium">Google Login ยังไม่ได้ตั้งค่า</p>
              <p className="text-sm mt-1">
                กรุณาติดต่อผู้ดูแลระบบเพื่อตั้งค่า Google Login
              </p>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading || !process.env.GOOGLE_CLIENT_ID}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  เข้าสู่ระบบด้วย Google
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
                ต้องการใช้ Line?{' '}
                <Link href="/auth/line" className="font-medium text-green-600 hover:text-green-500">
                  เข้าสู่ระบบด้วย Line
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
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
