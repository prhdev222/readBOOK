'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, BookLink } from '@/types';
import { formatLinkForDisplay } from '@/lib/link-utils';

// ข้อมูลหนังสือตัวอย่าง
const sampleBooks: Book[] = [
  {
    id: '1',
    title: 'การเขียนโปรแกรม Python',
    author: 'ดร.สมชาย ใจดี',
    description: 'หนังสือสอนการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น',
    coverImage: '/api/placeholder/300/400',
    category: 'เทคโนโลยี',
    tags: ['Python', 'Programming', 'Beginner'],
    publishedDate: '2024-01-15',
    language: 'ไทย',
    pages: 250,
    links: [
      {
        id: '1',
        type: 'google_drive',
        url: 'https://drive.google.com/file/d/example1/view',
        title: 'Google Drive',
        isPrimary: true,
        isActive: true
      },
      {
        id: '2',
        type: 'dropbox',
        url: 'https://dropbox.com/s/example2/file.pdf',
        title: 'Dropbox',
        isPrimary: false,
        isActive: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    author: 'Dr. Jane Smith',
    description: 'A comprehensive guide to machine learning concepts and applications',
    coverImage: '/api/placeholder/300/400',
    category: 'AI & Data Science',
    tags: ['Machine Learning', 'AI', 'Data Science'],
    publishedDate: '2024-02-01',
    language: 'English',
    pages: 400,
    links: [
      {
        id: '3',
        type: 'onedrive',
        url: 'https://1drv.ms/b/s!example3',
        title: 'OneDrive',
        isPrimary: true,
        isActive: true
      },
      {
        id: '4',
        type: 'mega',
        url: 'https://mega.nz/file/example4',
        title: 'MEGA',
        isPrimary: false,
        isActive: true
      }
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  }
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(sampleBooks);

  // ฟิลเตอร์หนังสือ
  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedCategory]);

  // ดึงหมวดหมู่ที่ไม่ซ้ำ
  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))];

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
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Book Cover */}
              <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
              
              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  โดย {book.author}
                </p>
                <p className="text-gray-500 text-xs mb-3">
                  {book.category} • {book.language}
                </p>
                
                {/* Links */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">ลิงก์ดาวน์โหลด:</div>
                  {book.links.map((link) => {
                    const linkInfo = formatLinkForDisplay(link);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 text-xs ${linkInfo.color} hover:underline`}
                      >
                        <span>{linkInfo.icon}</span>
                        <span className="truncate">{link.title}</span>
                        {link.isPrimary && (
                          <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">
                            หลัก
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <Link
                    href={`/reader/${book.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    อ่าน
                  </Link>
                  <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors">
                    รายละเอียด
                  </button>
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
