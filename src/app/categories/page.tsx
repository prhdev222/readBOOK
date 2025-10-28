'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  language: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  book_count: number;
  created_at: string;
}

function CategoriesPageContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // โหลดข้อมูลหมวดหมู่
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;

      // โหลดข้อมูลสื่อความรู้
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('id, title, author, description, category, language, created_at')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      setCategories(categoriesData || []);
      setBooks(booksData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // จัดกลุ่มสื่อความรู้ตามหมวดหมู่
  const booksByCategory = books.reduce((acc, book) => {
    if (!acc[book.category]) {
      acc[book.category] = [];
    }
    acc[book.category].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  // ข้อมูลหมวดหมู่พร้อมไอคอนและสีจาก Supabase
  const getCategoryInfo = (categoryName: string) => {
    const categoryFromDb = categories.find(cat => cat.name === categoryName);

    if (categoryFromDb) {
      return {
        icon: categoryFromDb.icon,
        color: 'from-' + categoryFromDb.color.replace('#', '') + ' to-' + categoryFromDb.color.replace('#', '') + '-600',
        description: categoryFromDb.description || `สื่อความรู้ในหมวดหมู่ ${categoryName}`,
        // ให้ type ของ info มี backgroundColor เสมอ (อาจเป็น undefined)
        backgroundColor: undefined as string | undefined,
      };
    }

    // Fallback colors for categories not in database
    const fallbackColors: Record<string, { icon: string; color: string; description: string; backgroundColor?: string }> = {
      'เทคโนโลยี': {
        icon: '💻',
        color: 'from-blue-500 to-cyan-600',
        description: 'สื่อความรู้เกี่ยวกับการเขียนโปรแกรม คอมพิวเตอร์ และเทคโนโลยี',
        backgroundColor: undefined,
      },
      'AI & Data Science': {
        icon: '🤖',
        color: 'from-purple-500 to-pink-600',
        description: 'ปัญญาประดิษฐ์ การเรียนรู้ของเครื่อง และวิทยาศาสตร์ข้อมูล',
        backgroundColor: undefined,
      },
      'การออกแบบ': {
        icon: '🎨',
        color: 'from-green-500 to-teal-600',
        description: 'การออกแบบ UI/UX กราฟิก และดีไซน์ต่างๆ',
        backgroundColor: undefined,
      },
      'ธุรกิจ': {
        icon: '💼',
        color: 'from-orange-500 to-red-600',
        description: 'การบริหาร การลงทุน และการพัฒนาธุรกิจ',
        backgroundColor: undefined,
      },
      'การศึกษา': {
        icon: '📖',
        color: 'from-indigo-500 to-blue-600',
        description: 'สื่อความรู้เพื่อการศึกษาและการเรียนรู้',
        backgroundColor: undefined,
      },
      'ไลฟ์สไตล์': {
        icon: '🌟',
        color: 'from-pink-500 to-rose-600',
        description: 'การใช้ชีวิต สุขภาพ และการพัฒนาตนเอง',
        backgroundColor: undefined,
      }
    };

    return fallbackColors[categoryName] || {
      icon: '📚',
      color: 'from-gray-500 to-gray-600',
      description: `สื่อความรู้ในหมวดหมู่ ${categoryName}`,
      backgroundColor: undefined,
    };
  };

  // แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🏛️ สื่อความรู้เพื่อพระสงฆ์
              </Link>
              <nav className="flex space-x-8">
                <Link href="/books" className="text-gray-600 hover:text-gray-900">
                  สื่อทั้งหมด
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900">
                  ค้นหา
                </Link>
                <Link href="/categories" className="text-blue-600 font-medium">
                  หมวดหมู่
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">กำลังโหลด...</p>
          </div>
        </main>
      </div>
    );
  }

  // แสดง error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🏛️ สื่อความรู้เพื่อพระสงฆ์
              </Link>
              <nav className="flex space-x-8">
                <Link href="/books" className="text-gray-600 hover:text-gray-900">
                  สื่อทั้งหมด
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900">
                  ค้นหา
                </Link>
                <Link href="/categories" className="text-blue-600 font-medium">
                  หมวดหมู่
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        </main>
      </div>
    );
  }

  // แสดงหมวดหมู่จากฐานข้อมูล หรือ fallback จากสื่อความรู้
  const displayCategories = categories.length > 0
    ? categories.map(cat => ({
        name: cat.name,
        books: booksByCategory[cat.name] || [],
        info: {
          icon: cat.icon,
          color: 'from-blue-500 to-blue-600', // ใช้สีพื้นฐานแทน dynamic color
          backgroundColor: cat.color, // เก็บสีจริงไว้สำหรับใช้ใน style
          description: cat.description || `สื่อความรู้ในหมวดหมู่ ${cat.name}`
        }
      }))
    : Object.entries(booksByCategory).map(([categoryName, categoryBooks]) => ({
        name: categoryName,
        books: categoryBooks,
        info: getCategoryInfo(categoryName)
      }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              🏛️ สื่อความรู้เพื่อพระสงฆ์
            </Link>
            <nav className="flex space-x-8">
              <Link href="/books" className="text-gray-600 hover:text-gray-900">
                สื่อทั้งหมด
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900">
                ค้นหา
              </Link>
              <Link href="/categories" className="text-blue-600 font-medium">
                หมวดหมู่
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">หมวดหมู่สื่อความรู้</h1>
          <p className="text-xl text-gray-600">
            เลือกหมวดหมู่ที่คุณสนใจเพื่อค้นหาสื่อความรู้ที่เกี่ยวข้อง
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayCategories.map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <Link href={`/books?category=${encodeURIComponent(category.name)}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* Category Header */}
                  <div 
                    className="p-8 text-white text-center"
                    style={{ 
                      background: category.info.backgroundColor 
                        ? `linear-gradient(135deg, ${category.info.backgroundColor}20, ${category.info.backgroundColor})`
                        : `linear-gradient(135deg, ${category.info.color})`
                    }}
                  >
                    <div className="text-5xl mb-4">{category.info.icon}</div>
                    <h2
                      className="text-3xl font-extrabold mb-2 tracking-wide drop-shadow"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}
                    >
                      {category.name}
                    </h2>
                    <p className="text-white/80 text-sm">{category.info.description}</p>
                  </div>

                  {/* Category Stats */}
                  <div className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600">จำนวนสื่อความรู้</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {category.books.length}
                      </span>
                    </div>

                    {/* Recent Books in Category */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">สื่อความรู้ล่าสุด:</h4>
                      {category.books.slice(0, 3).map((book) => (
                        <div key={book.id} className="flex items-center space-x-3 text-sm">
                          <div className="w-8 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-xs">📖</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{book.title}</p>
                            <p className="text-gray-500 text-xs">{book.author}</p>
                          </div>
                        </div>
                      ))}
                      {category.books.length > 3 && (
                        <p className="text-xs text-gray-500 text-center pt-2">
                          และอีก {category.books.length - 3} รายการ...
                        </p>
                      )}
                    </div>

                    {/* View All Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                        ดูสื่อทั้งหมดในหมวดหมู่ →
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty Categories Section */}
        {displayCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ยังไม่มีหมวดหมู่
            </h3>
            <p className="text-gray-600 mb-4">
              ยังไม่มีสื่อความรู้ในระบบ ลองเพิ่มสื่อความรู้ก่อนนะครับ
            </p>
            <Link
              href="/books"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              ดูสื่อทั้งหมด
            </Link>
          </div>
        )}

        {/* Statistics */}
        {displayCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">สถิติหมวดหมู่</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{displayCategories.length}</div>
                <div className="text-sm text-gray-600">หมวดหมู่ทั้งหมด</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{books.length}</div>
                <div className="text-sm text-gray-600">สื่อทั้งหมด</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...displayCategories.map(cat => cat.books.length))}
                </div>
                <div className="text-sm text-gray-600">สื่อความรู้ในหมวดหมู่ที่ใหญ่ที่สุด</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {displayCategories.sort((a, b) => b.books.length - a.books.length)[0]?.name || '-'}
                </div>
                <div className="text-sm text-gray-600">หมวดหมู่ยอดนิยม</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoriesPageContent;