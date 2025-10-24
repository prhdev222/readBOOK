'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book, BookLink, Category } from '@/types';
import { createBookLink, validateLink, detectLinkType } from '@/lib/link-utils';

export default function AddBookPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
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

  // ดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
  const removeLink = (index: number) => {
    setNewBook(prev => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index) || []
    }));
  };

  // เพิ่มแท็ก
  const addTag = (tag: string) => {
    if (tag.trim() && !newBook.tags?.includes(tag.trim())) {
      setNewBook(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }));
    }
  };

  // ลบแท็ก
  const removeTag = (tag: string) => {
    setNewBook(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  // บันทึกหนังสือ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });

      const data = await response.json();
      if (data.success) {
        alert('เพิ่มหนังสือสำเร็จ!');
        // รีเซ็ตฟอร์ม
        setNewBook({
          title: '',
          author: '',
          description: '',
          category: '',
          tags: [],
          language: 'ไทย',
          links: []
        });
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มหนังสือ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">กำลังโหลด...</p>
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
              <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900">
                จัดการหมวดหมู่
              </Link>
              <Link href="/admin/statistics" className="text-gray-600 hover:text-gray-900">
                สถิติ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">เพิ่มหนังสือใหม่</h1>
          <Link
            href="/admin/books"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            ← กลับไปจัดการหนังสือ
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ข้อมูลพื้นฐาน */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">ข้อมูลหนังสือ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหนังสือ *
                </label>
                <input
                  type="text"
                  value={newBook.title || ''}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น การเขียนโปรแกรม Python"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ผู้แต่ง *
                </label>
                <input
                  type="text"
                  value={newBook.author || ''}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น ดร.สมชาย ใจดี"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่ *
                </label>
                <select
                  value={newBook.category || ''}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ยังไม่มีหมวดหมู่ <Link href="/admin/categories" className="text-blue-600 hover:underline">เพิ่มหมวดหมู่</Link>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ภาษา
                </label>
                <select
                  value={newBook.language || 'ไทย'}
                  onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ไทย">ไทย</option>
                  <option value="English">English</option>
                  <option value="中文">中文</option>
                  <option value="日本語">日本語</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำอธิบาย
              </label>
              <textarea
                value={newBook.description || ''}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="คำอธิบายเกี่ยวกับหนังสือ..."
              />
            </div>
          </div>

          {/* แท็ก */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">แท็ก</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {newBook.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="เพิ่มแท็ก..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="เพิ่มแท็ก..."]') as HTMLInputElement;
                  if (input) {
                    addTag(input.value);
                    input.value = '';
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                เพิ่ม
              </button>
            </div>
          </div>

          {/* ลิงก์ดาวน์โหลด */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">ลิงก์ดาวน์โหลด</h2>
            
            {/* ฟอร์มเพิ่มลิงก์ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL ลิงก์
                </label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อลิงก์
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น Google Drive, Dropbox"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <input
                  type="text"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น ไฟล์ PDF คุณภาพสูง"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newLink.isPrimary}
                    onChange={(e) => setNewLink({ ...newLink, isPrimary: e.target.checked })}
                    className="mr-2"
                  />
                  ลิงก์หลัก
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={addLink}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ เพิ่มลิงก์
            </button>

            {/* รายการลิงก์ */}
            {newBook.links && newBook.links.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">ลิงก์ที่เพิ่มแล้ว</h3>
                <div className="space-y-2">
                  {newBook.links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{link.title}</span>
                          {link.isPrimary && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              หลัก
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{link.url}</p>
                        {link.description && (
                          <p className="text-sm text-gray-500">{link.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        ลบ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ปุ่มบันทึก */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/books"
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกหนังสือ'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
