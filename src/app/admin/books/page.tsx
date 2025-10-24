'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, BookLink } from '@/types';
import { createBookLink, validateLink, detectLinkType } from '@/lib/link-utils';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    description: '',
    category: '',
    tags: [],
    language: 'ไทย',
    links: []
  });
  const [newLink, setNewLink] = useState({
    url: '',
    title: '',
    description: '',
    isPrimary: false
  });

  // เพิ่มลิงก์ใหม่
  const addLink = () => {
    const validation = validateLink(newLink.url);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const link = createBookLink(
      newLink.url,
      newLink.title || detectLinkType(newLink.url),
      newLink.description,
      newLink.isPrimary
    );

    setNewBook(prev => ({
      ...prev,
      links: [...(prev.links || []), link]
    }));

    setNewLink({
      url: '',
      title: '',
      description: '',
      isPrimary: false
    });
  };

  // ลบลิงก์
  const removeLink = (linkId: string) => {
    setNewBook(prev => ({
      ...prev,
      links: prev.links?.filter(link => link.id !== linkId) || []
    }));
  };

  // บันทึกหนังสือ
  const saveBook = () => {
    if (!newBook.title || !newBook.author || !newBook.category) {
      alert('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    if (!newBook.links || newBook.links.length === 0) {
      alert('กรุณาเพิ่มลิงก์อย่างน้อย 1 ลิงก์');
      return;
    }

    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author,
      description: newBook.description,
      category: newBook.category,
      tags: newBook.tags || [],
      language: newBook.language || 'ไทย',
      links: newBook.links,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBooks(prev => [...prev, book]);
    setNewBook({
      title: '',
      author: '',
      description: '',
      category: '',
      tags: [],
      language: 'ไทย',
      links: []
    });
    setShowAddForm(false);
  };

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
              <Link href="/admin/books" className="text-blue-600 font-medium">
                จัดการหนังสือ
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900">
                หมวดหมู่
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                ผู้ใช้
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">จัดการหนังสือ</h1>
          <div className="flex space-x-4">
            <Link
              href="/admin/books/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              ➕ เพิ่มหนังสือ
            </Link>
            <Link
              href="/admin/categories"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🏷️ จัดการหมวดหมู่
            </Link>
          </div>
        </div>

        {/* Add Book Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">เพิ่มหนังสือใหม่</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อหนังสือ *
                </label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ผู้แต่ง *
                </label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมวดหมู่ *
                </label>
                <input
                  type="text"
                  value={newBook.category}
                  onChange={(e) => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ภาษา
                </label>
                <select
                  value={newBook.language}
                  onChange={(e) => setNewBook(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ไทย">ไทย</option>
                  <option value="English">English</option>
                  <option value="中文">中文</option>
                  <option value="日本語">日本語</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คำอธิบาย
              </label>
              <textarea
                value={newBook.description}
                onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Links Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">ลิงก์ดาวน์โหลด</h3>
              
              {/* Add Link Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL ลิงก์ *
                    </label>
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อลิงก์
                    </label>
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Google Drive, Dropbox, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบายลิงก์
                  </label>
                  <input
                    type="text"
                    value={newLink.description}
                    onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="เช่น: ไฟล์ PDF คุณภาพสูง"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={newLink.isPrimary}
                    onChange={(e) => setNewLink(prev => ({ ...prev, isPrimary: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isPrimary" className="text-sm text-gray-700">
                    ลิงก์หลัก (จะแสดงเป็นลิงก์แรก)
                  </label>
                </div>
                
                <button
                  onClick={addLink}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  เพิ่มลิงก์
                </button>
              </div>
              
              {/* Current Links */}
              {newBook.links && newBook.links.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">ลิงก์ที่เพิ่มแล้ว:</h4>
                  {newBook.links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{link.title}</span>
                          {link.isPrimary && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              หลัก
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{link.url}</div>
                      </div>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={saveBook}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                บันทึกหนังสือ
              </button>
            </div>
          </div>
        )}

        {/* Books List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">รายการหนังสือ ({books.length})</h2>
          </div>
          
          {books.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              ยังไม่มีหนังสือในระบบ
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {books.map((book) => (
                <div key={book.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-gray-600">โดย {book.author}</p>
                      <p className="text-sm text-gray-500">{book.category} • {book.language}</p>
                      
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-700 mb-1">ลิงก์ดาวน์โหลด:</div>
                        <div className="flex flex-wrap gap-2">
                          {book.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <span>{link.isPrimary ? '⭐' : '🔗'}</span>
                              <span>{link.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        แก้ไข
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
