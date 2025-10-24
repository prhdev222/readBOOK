'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'เกิดข้อผิดพลาดในการตั้งค่าระบบ';
      case 'AccessDenied':
        return 'คุณไม่มีสิทธิ์เข้าถึง';
      case 'Verification':
        return 'การยืนยันตัวตนล้มเหลว';
      case 'missing_code':
        return 'ไม่พบ authorization code จาก Line';
      case 'no_access_token':
        return 'ไม่สามารถรับ access token จาก Line ได้';
      case 'database_error':
        return 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      case 'line_login_failed':
        return 'การเข้าสู่ระบบด้วย Line ล้มเหลว';
      case 'invalid_request':
        return 'คำขอไม่ถูกต้อง';
      case 'unauthorized_client':
        return 'Client ไม่ได้รับอนุญาต';
      case 'access_denied':
        return 'ผู้ใช้ปฏิเสธการอนุญาต';
      case 'invalid_scope':
        return 'Scope ที่ขอไม่ถูกต้อง';
      default:
        return 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
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
            เกิดข้อผิดพลาด
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {getErrorMessage(error)}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ลองใหม่อีกครั้ง
              </Link>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
