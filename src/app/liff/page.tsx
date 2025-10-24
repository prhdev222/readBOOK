'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  initializeLiff, 
  isInLineApp, 
  getLiffProfile, 
  shareToLine, 
  closeLiffApp,
  isLiffAvailable 
} from '@/lib/liff';

interface LiffUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export default function LiffPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<LiffUser | null>(null);
  const [isInLine, setIsInLine] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initLiff = async () => {
      try {
        if (!isLiffAvailable()) {
          setError('LIFF ไม่พร้อมใช้งาน');
          setLoading(false);
          return;
        }

        const success = await initializeLiff();
        if (!success) {
          setError('ไม่สามารถเริ่มต้น LIFF ได้');
          setLoading(false);
          return;
        }

        setIsInLine(isInLineApp());

        if (isInLineApp()) {
          try {
            const profile = await getLiffProfile();
            setUser(profile);
          } catch (error) {
            console.error('Error getting profile:', error);
            setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
          }
        }

      } catch (error) {
        console.error('LIFF initialization error:', error);
        setError('เกิดข้อผิดพลาดในการเริ่มต้น LIFF');
      } finally {
        setLoading(false);
      }
    };

    initLiff();
  }, []);

  const handleShareBook = async (bookTitle: string, bookUrl: string) => {
    try {
      await shareToLine(
        `📚 หนังสือแนะนำ: ${bookTitle}`,
        bookUrl
      );
    } catch (error) {
      console.error('Share failed:', error);
      alert('ไม่สามารถแชร์ได้');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            กลับไปหน้าหลัก
          </Link>
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
              {isInLine && (
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  LINE App
                </span>
              )}
            </div>
            {isInLine && (
              <button
                onClick={closeLiffApp}
                className="text-gray-600 hover:text-gray-900"
              >
                ปิด
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              {user.pictureUrl && (
                <img
                  src={user.pictureUrl}
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  สวัสดี, {user.displayName}
                </h2>
                {user.statusMessage && (
                  <p className="text-gray-600">{user.statusMessage}</p>
                )}
                <p className="text-sm text-gray-500">
                  User ID: {user.userId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ยินดีต้อนรับสู่ readBOOK
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {isInLine 
              ? 'อ่านหนังสือผ่าน Line ได้แล้ว!' 
              : 'แพลตฟอร์มอ่านหนังสือออนไลน์ที่ทันสมัย'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              หนังสือทั้งหมด
            </h3>
            <p className="text-gray-600 mb-4">
              ดูหนังสือทั้งหมดที่มีในระบบ
            </p>
            <Link
              href="/books"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              ดูหนังสือ
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ค้นหาหนังสือ
            </h3>
            <p className="text-gray-600 mb-4">
              ค้นหาหนังสือที่ต้องการ
            </p>
            <Link
              href="/search"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
            >
              ค้นหา
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏷️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              หมวดหมู่
            </h3>
            <p className="text-gray-600 mb-4">
              ดูหนังสือตามหมวดหมู่
            </p>
            <Link
              href="/categories"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              หมวดหมู่
            </Link>
          </div>
        </div>

        {/* Sample Books */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            หนังสือแนะนำ
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'การเขียนโปรแกรม Python',
                author: 'ดร.สมชาย ใจดี',
                description: 'หนังสือสอนการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น'
              },
              {
                title: 'Machine Learning Fundamentals',
                author: 'Dr. Jane Smith',
                description: 'A comprehensive guide to machine learning concepts'
              },
              {
                title: 'การลงทุนในหุ้น',
                author: 'คุณสมศรี ใจดี',
                description: 'คู่มือการลงทุนในตลาดหุ้นสำหรับผู้เริ่มต้น'
              }
            ].map((book, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{book.title}</h4>
                <p className="text-sm text-gray-600 mb-2">โดย {book.author}</p>
                <p className="text-sm text-gray-500 mb-4">{book.description}</p>
                <div className="flex space-x-2">
                  <Link
                    href={`/books/${index + 1}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    อ่าน
                  </Link>
                  {isInLine && (
                    <button
                      onClick={() => handleShareBook(book.title, `/books/${index + 1}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      แชร์
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line App Features */}
        {isInLine && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              🎉 ฟีเจอร์พิเศษสำหรับ Line App
            </h3>
            <ul className="space-y-2 text-green-800">
              <li>• แชร์หนังสือให้เพื่อนผ่าน Line</li>
              <li>• อ่านหนังสือได้โดยไม่ต้องออกจาก Line</li>
              <li>• บันทึกความคืบหน้าการอ่าน</li>
              <li>• แจ้งเตือนหนังสือใหม่</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
