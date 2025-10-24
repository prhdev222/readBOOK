'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 readBOOK</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/books" className="text-gray-600 hover:text-gray-900">
                หนังสือทั้งหมด
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900">
                ค้นหา
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                หมวดหมู่
              </Link>
              {!mounted ? (
                <div className="flex space-x-4">
                  <div className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg">
                    กำลังโหลด...
                  </div>
                </div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    สวัสดี, {session.user?.name || 'ผู้ใช้'}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    เข้าสู่ระบบด้วย Google
                  </Link>
                  <Link href="/auth/line" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    เข้าสู่ระบบด้วย Line
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่ readBOOK
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            ระบบจัดการหนังสือดิจิทัลที่ทันสมัยและใช้งานง่าย
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/books"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ดูหนังสือทั้งหมด
            </Link>
            <Link
              href="/search"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              ค้นหาหนังสือ
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-2">อ่านหนังสือ</h3>
            <p className="text-gray-600">
              อ่านหนังสือในรูปแบบดิจิทัลได้ทุกที่ทุกเวลา
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">ค้นหาขั้นสูง</h3>
            <p className="text-gray-600">
              ค้นหาหนังสือด้วยชื่อ ผู้แต่ง หรือหมวดหมู่
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">จัดการหนังสือ</h3>
            <p className="text-gray-600">
              จัดการหนังสือของคุณได้อย่างเป็นระบบ
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">เมนูหลัก</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/books"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📚</span>
              <span>หนังสือทั้งหมด</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🏷️</span>
              <span>หมวดหมู่</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔍</span>
              <span>ค้นหา</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">👤</span>
              <span>โปรไฟล์</span>
            </Link>
            <Link
              href="/debug"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔧</span>
              <span>Debug</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 readBOOK. ระบบจัดการหนังสือดิจิทัล</p>
        </div>
      </footer>
    </div>
  );
}
