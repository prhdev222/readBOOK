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

function SearchPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<BookWithLinks[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadData();

    // โหลดประวัติการค้นหาจาก localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks([]);
      return;
    }

    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.tags && book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    setFilteredBooks(filtered);
  }, [books, searchQuery]);

  const loadData = async () => {
    try {
      // Fetch books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      // Fetch links for all books
      const { data: linksData, error: linksError } = await supabase
        .from('book_links')
        .select('*')
        .eq('is_active', true);

      if (linksError) throw linksError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;

      // Combine books with their links
      const booksWithLinks: BookWithLinks[] = (booksData || []).map(book => ({
        ...book,
        links: linksData?.filter(link => link.book_id === book.id) || []
      }));

      setBooks(booksWithLinks);
      setCategories(categoriesData?.map(cat => cat.name) || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // บันทึกประวัติการค้นหา
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

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
                <Link href="/books" className="text-gray-600 hover:text-gray-900">
                  หนังสือทั้งหมด
                </Link>
                <Link href="/search" className="text-blue-600 font-medium">
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
              <Link href="/books" className="text-gray-600 hover:text-gray-900">
                หนังสือทั้งหมด
              </Link>
              <Link href="/search" className="text-blue-600 font-medium">
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
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">ค้นหาหนังสือ</h1>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="ค้นหาหนังสือ, ผู้แต่ง, หมวดหมู่, หรือแท็ก..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🔍 ค้นหา
              </button>
            </div>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">ค้นหาล่าสุด:</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(term)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ผลการค้นหาสำหรับ "{searchQuery}" ({filteredBooks.length} รายการ)
            </h2>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Book Header */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📚</span>
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
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {book.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {book.language}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {book.description}
                      </p>

                      <div className="flex justify-center">
                        <Link
                          href={`/books/${book.id}`}
                          className="bg-blue-600 text-white text-center py-2 px-6 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          ℹ️ รายละเอียด
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ไม่พบผลการค้นหา
                </h3>
                <p className="text-gray-600 mb-4">
                  ลองใช้คำค้นหาอื่นหรือตรวจสอบคำสะกด
                </p>
                <Link
                  href="/books"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  ดูหนังสือทั้งหมด
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Popular Categories */}
        {!searchQuery.trim() && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">หมวดหมู่ยอดนิยม</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category}
                  href={`/books?category=${encodeURIComponent(category)}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-medium text-gray-900">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPageContent;