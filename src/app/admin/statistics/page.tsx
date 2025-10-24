'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Statistics {
  totalBooks: number;
  totalLinks: number;
  totalCategories: number;
  linkTypes: Record<string, number>;
  recentBooks: Array<{
    id: string;
    title: string;
    author: string;
    createdAt: string;
  }>;
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      
      if (data.success) {
        setStatistics(data.data);
      } else {
        console.error('Statistics API error:', data);
        // แสดง error message ใน console
        if (data.details) {
          console.error('Error details:', data.details);
        }
        if (data.recommendations) {
          console.error('Recommendations:', data.recommendations);
        }
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
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
            <Link href="/" className="text-2xl font-bold text-gray-900">
              📚 readBOOK Admin
            </Link>
            <nav className="flex space-x-8">
              <Link href="/admin/books" className="text-gray-600 hover:text-gray-900">
                จัดการหนังสือ
              </Link>
              <Link href="/admin/statistics" className="text-blue-600 font-medium">
                สถิติ
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900">
                หมวดหมู่
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">สถิติระบบ</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">หนังสือทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ลิงก์ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalLinks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">หมวดหมู่</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalCategories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Link Types Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">สถิติประเภทลิงก์</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statistics.linkTypes).map(([type, count]) => {
              const icons: Record<string, string> = {
                google_drive: '📁',
                dropbox: '📦',
                onedrive: '☁️',
                mega: '🔒',
                mediafire: '🔥',
                direct: '🔗',
                other: '📄'
              };
              
              const names: Record<string, string> = {
                google_drive: 'Google Drive',
                dropbox: 'Dropbox',
                onedrive: 'OneDrive',
                mega: 'MEGA',
                mediafire: 'MediaFire',
                direct: 'Direct Link',
                other: 'อื่นๆ'
              };

              return (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">{icons[type] || '📄'}</div>
                  <div className="font-medium text-gray-900">{names[type] || type}</div>
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Books */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">หนังสือที่เพิ่มล่าสุด</h2>
          {statistics.recentBooks.length > 0 ? (
            <div className="space-y-3">
              {statistics.recentBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">โดย {book.author}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(book.createdAt).toLocaleDateString('th-TH')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">ยังไม่มีหนังสือในระบบ</p>
          )}
        </div>

        {/* API Documentation */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">API Endpoints สำหรับจัดการลิงก์</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded border-l-4 border-green-500">
              <code className="font-mono">GET /api/books</code>
              <p className="text-gray-600 mt-1">ดึงหนังสือทั้งหมด (รองรับ query, category, pagination)</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
              <code className="font-mono">POST /api/books</code>
              <p className="text-gray-600 mt-1">เพิ่มหนังสือใหม่</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-purple-500">
              <code className="font-mono">GET /api/books/[id]/links</code>
              <p className="text-gray-600 mt-1">ดึงลิงก์ทั้งหมดของหนังสือ</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-orange-500">
              <code className="font-mono">POST /api/books/[id]/links</code>
              <p className="text-gray-600 mt-1">เพิ่มลิงก์ให้หนังสือ</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-red-500">
              <code className="font-mono">PUT /api/links/[linkId]</code>
              <p className="text-gray-600 mt-1">อัปเดตลิงก์</p>
            </div>
            
            <div className="bg-white p-3 rounded border-l-4 border-red-500">
              <code className="font-mono">DELETE /api/links/[linkId]</code>
              <p className="text-gray-600 mt-1">ลบลิงก์</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
