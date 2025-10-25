'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  tags: string[];
  published_date?: string;
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

function BooksPageContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<BookWithLinks[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBooks, setFilteredBooks] = useState<BookWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get category from URL if exists
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    loadBooks();
  }, []);

  useEffect(() => {
    // Update filtered books when books, searchQuery, or selectedCategory changes
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedCategory]);

  const loadBooks = async () => {
    try {
      // Fetch books with their links
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      // Fetch links for all books
      const { data: linksData, error: linksError } = await supabase
        .from('book_links')
        .select('*')
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (linksError) throw linksError;

      // Combine books with their links
      const booksWithLinks: BookWithLinks[] = (booksData || []).map(book => ({
        ...book,
        links: linksData?.filter(link => link.book_id === book.id) || []
      }));

      setBooks(booksWithLinks);
    } catch (error) {
      console.error('Error loading books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  // ดึงหมวดหมู่ที่ไม่ซ้ำ
  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))];

  // แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                📚 readBOOK
              </Link>
              <nav className="flex space-x-8">
                <Link href="/books" className="text-blue-600 font-medium">
                  หนังสือทั้งหมด
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900">
                  ค้นหา
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
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
                📚 readBOOK
              </Link>
              <nav className="flex space-x-8">
                <Link href="/books" className="text-blue-600 font-medium">
                  หนังสือทั้งหมด
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900">
                  ค้นหา
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
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
              onClick={loadBooks}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        </main>
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
              📚 readBOOK
            </Link>
            <nav className="flex space-x-8">
              <Link href="/books" className="text-blue-600 font-medium">
                หนังสือทั้งหมด
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900">
                ค้นหา
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                หมวดหมู่
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาหนังสือ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">ทุกหมวดหมู่</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            พบหนังสือ {filteredBooks.length} เล่ม
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              {/* Book Header with Gradient */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-center">
                  {book.title}
                </h3>
                <p className="text-blue-100 text-sm text-center">
                  โดย {book.author}
                </p>
              </div>

              {/* Book Info */}
              <div className="p-6">
                {/* Category and Language */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {book.category}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {book.language}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {book.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {book.tags && book.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {book.tags && book.tags.length > 3 && (
                    <span className="text-gray-400 text-xs">
                      +{book.tags.length - 3} อื่นๆ
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-medium text-gray-700 flex items-center">
                    <span className="mr-2">🔗</span>
                    ลิงก์ดาวน์โหลด:
                  </div>
                  {book.links && book.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-xs p-2 rounded-lg border text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg">📁</span>
                      <span className="truncate flex-1">{link.title}</span>
                      {link.is_primary && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          หลัก
                        </span>
                      )}
                    </a>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                  <Link
                    href={`/books/${book.id}`}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    ℹ️ รายละเอียด
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่พบหนังสือ
            </h3>
            <p className="text-gray-600">
              ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูครับ
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                📚 readBOOK
              </Link>
              <nav className="flex space-x-8">
                <Link href="/books" className="text-blue-600 font-medium">
                  หนังสือทั้งหมด
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-gray-900">
                  ค้นหา
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
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
    }>
      <BooksPageContent />
    </Suspense>
  );
}

