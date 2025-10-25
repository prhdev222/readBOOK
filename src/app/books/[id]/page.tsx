'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  language: string;
  pages?: number;
  created_at: string;
  updated_at: string;
}

interface BookLink {
  id: string;
  book_id: string;
  type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other';
  url: string;
  title: string;
  description?: string;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BookWithLinks extends Book {
  links: BookLink[];
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<BookWithLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBook();
  }, [params.id]);

  const loadBook = async () => {
    try {
      const bookId = params.id as string;

      // Fetch book data
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;

      // Fetch book links
      const { data: linksData, error: linksError } = await supabase
        .from('book_links')
        .select('*')
        .eq('book_id', bookId)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (linksError) throw linksError;

      const bookWithLinks: BookWithLinks = {
        ...bookData,
        links: linksData || []
      };

      setBook(bookWithLinks);
    } catch (error) {
      console.error('Error loading book:', error);
      setError('ไม่พบหนังสือที่คุณต้องการ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบหนังสือ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/books"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับไปหน้าหนังสือทั้งหมด
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← กลับ
              </button>
              <Link href="/" className="text-2xl font-bold text-gray-900">
                📚 readBOOK
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/books" className="text-blue-600 font-medium">
                หนังสือทั้งหมด
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900">
                ค้นหา
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Book Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-xl text-blue-100 mb-4">โดย {book.author}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {book.category}
                  </span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {book.language}
                  </span>
                  {book.pages && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      {book.pages} หน้า
                    </span>
                  )}
                </div>
              </div>
              <div className="text-6xl opacity-20">📚</div>
            </div>
          </div>

          {/* Book Content */}
          <div className="p-8">
            {/* Description */}
            {book.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">คำอธิบาย</h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Download Links */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ลิงก์ดาวน์โหลด</h2>
              {book.links.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {book.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      download
                      className="block bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {link.type === 'google_drive' ? '📁' : 
                           link.type === 'direct' ? '📥' : '🔗'}
                        </span>
                        <div>
                          <div className="font-semibold">{link.title}</div>
                          <div className="text-sm opacity-90">
                            {link.type === 'google_drive' ? 'Google Drive' :
                             link.type === 'direct' ? 'ดาวน์โหลดไฟล์' : 'ลิงก์อื่น'}
                          </div>
                        </div>
                        {link.is_primary && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                            หลัก
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">ไม่มีลิงก์ดาวน์โหลดสำหรับหนังสือเล่มนี้</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Link
                href="/books"
                className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
              >
                หนังสือทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
