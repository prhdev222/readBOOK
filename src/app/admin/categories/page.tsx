'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  bookCount: number;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // ฟอร์มเพิ่ม/แก้ไขหมวดหมู่
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: '📚'
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

  // เพิ่มหมวดหมู่
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setShowAddForm(false);
        setFormData({ name: '', color: '#3B82F6', icon: '📚' });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // แก้ไขหมวดหมู่
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setEditingCategory(null);
        setFormData({ name: '', color: '#3B82F6', icon: '📚' });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // ลบหมวดหมู่
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // เริ่มแก้ไข
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
  };

  // ยกเลิกแก้ไข
  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', color: '#3B82F6', icon: '📚' });
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
              <Link href="/admin/books" className="text-gray-600 hover:text-gray-900">
                จัดการหนังสือ
              </Link>
              <Link href="/admin/categories" className="text-blue-600 font-medium">
                จัดการหมวดหมู่
              </Link>
              <Link href="/admin/statistics" className="text-gray-600 hover:text-gray-900">
                สถิติ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">จัดการหมวดหมู่</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ➕ เพิ่มหมวดหมู่
          </button>
        </div>

        {/* ฟอร์มเพิ่ม/แก้ไขหมวดหมู่ */}
        {(showAddForm || editingCategory) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
            </h2>
            
            <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อหมวดหมู่
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="เช่น เทคโนโลยี, การเงิน"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สี
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ไอคอน
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="📚">📚 หนังสือ</option>
                    <option value="💻">💻 เทคโนโลยี</option>
                    <option value="🤖">🤖 AI & Data Science</option>
                    <option value="💰">💰 การเงิน</option>
                    <option value="🏥">🏥 สุขภาพ</option>
                    <option value="💼">💼 ธุรกิจ</option>
                    <option value="🎨">🎨 ศิลปะ</option>
                    <option value="🏃">🏃 กีฬา</option>
                    <option value="🍳">🍳 อาหาร</option>
                    <option value="✈️">✈️ ท่องเที่ยว</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={editingCategory ? cancelEdit : () => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* รายการหมวดหมู่ */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.bookCount} หนังสือ
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">ยังไม่มีหมวดหมู่</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              เพิ่มหมวดหมู่แรก
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
