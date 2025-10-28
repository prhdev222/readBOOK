'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, BookLink } from '@/lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  language: string;
  created_at: string;
  updated_at: string;
}

// ใช้ BookLink จาก supabase.ts

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

function EditBookPageContent() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [book, setBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    description: '',
    category: '',
    language: 'ไทย',
    created_at: '',
    updated_at: ''
  });

  const [links, setLinks] = useState<BookLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    loadBook();
    loadCategories();
  }, [bookId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const loadBook = async () => {
    try {
      // Load book data
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;
      if (!bookData) {
        setError('Book not found');
        return;
      }

      setBook(bookData);

      // Load book links
      const { data: linksData, error: linksError } = await supabase
        .from('book_links')
        .select('*')
        .eq('book_id', bookId)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (linksError) throw linksError;
      setLinks(linksData || []);

    } catch (error) {
      console.error('Error loading book:', error);
      setError('Failed to load book data');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index: number, field: string, value: string | boolean | number) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };

    // If setting is_primary to true, set all others to false
    if (field === 'is_primary' && value === true) {
      newLinks.forEach((link, i) => {
        if (i !== index) {
          link.is_primary = false;
        }
      });
    }

    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, { 
      id: '', 
      book_id: bookId, 
      type: 'google_drive', 
      url: '', 
      title: '', 
      is_primary: false, 
      is_active: true,
      media_type: 'file',
      description: '',
      thumbnail_url: '',
      duration: 0,
      file_size: 0,
      mime_type: '',
      collection_id: '',
      created_at: '',
      updated_at: ''
    }]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!book.title || !book.author || !book.category) {
        setError('Title, author, and category are required');
        return;
      }

      // Use API route to update book
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          description: book.description || null,
          category: book.category,
          language: book.language,
          links: links
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update book');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/books');
      }, 2000);

    } catch (error) {
      console.error('Error updating book:', error);
      setError(error instanceof Error ? error.message : 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading book data...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Updated Successfully!</h2>
          <p className="text-gray-600">Redirecting to books list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/books" className="text-lg text-gray-600 hover:text-gray-900 mr-4">
                ← Books
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Book</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Book Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={book.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  value={book.author}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={loadCategories}
                      className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={categoriesLoading}
                      title="รีเฟรชหมวดหมู่"
                    >
                      {categoriesLoading ? 'กำลังรีเฟรช...' : 'รีเฟรช'}
                    </button>
                    <Link
                      href="/admin/categories"
                      className="text-xs text-blue-600 hover:text-blue-800"
                      title="เพิ่มหมวดหมู่ใหม่"
                    >
                      + เพิ่มหมวดหมู่
                    </Link>
                  </div>
                </div>
                <select
                  id="category"
                  name="category"
                  required
                  value={book.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={book.language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ไทย">ไทย</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={book.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter book description"
              />
            </div>
          </div>

          {/* Download Links */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Download Links</h2>
              <button
                type="button"
                onClick={addLink}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700"
              >
                + Add Link
              </button>
            </div>

            {links.map((link, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Link Type
                    </label>
                    <select
                      value={link.type}
                      onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <optgroup label="Cloud Storage">
                        <option value="google_drive">Google Drive</option>
                        <option value="dropbox">Dropbox</option>
                        <option value="onedrive">OneDrive</option>
                        <option value="mega">MEGA</option>
                        <option value="mediafire">MediaFire</option>
                        <option value="direct">Direct Link</option>
                      </optgroup>
                      <optgroup label="Media Platforms">
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="soundcloud">SoundCloud</option>
                        <option value="spotify">Spotify</option>
                      </optgroup>
                      <optgroup label="Media Types">
                        <option value="image">รูปภาพ</option>
                        <option value="audio">เสียง/MP3</option>
                        <option value="video">วิดีโอ</option>
                        <option value="document">เอกสาร</option>
                      </optgroup>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Link Title
                    </label>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Google Drive, Dropbox"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Media Type
                    </label>
                    <select
                      value={link.media_type || 'file'}
                      onChange={(e) => handleLinkChange(index, 'media_type', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="file">ไฟล์</option>
                      <option value="image">รูปภาพ</option>
                      <option value="audio">เสียง</option>
                      <option value="video">วิดีโอ</option>
                      <option value="youtube">YouTube</option>
                      <option value="document">เอกสาร</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      URL
                    </label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Thumbnail URL (optional)
                    </label>
                    <input
                      type="url"
                      value={link.thumbnail_url || ''}
                      onChange={(e) => handleLinkChange(index, 'thumbnail_url', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration (seconds, optional)
                    </label>
                    <input
                      type="number"
                      value={link.duration || ''}
                      onChange={(e) => handleLinkChange(index, 'duration', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="180"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      File Size (bytes, optional)
                    </label>
                    <input
                      type="number"
                      value={link.file_size || ''}
                      onChange={(e) => handleLinkChange(index, 'file_size', parseInt(e.target.value) || 0)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1048576"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      MIME Type (optional)
                    </label>
                    <input
                      type="text"
                      value={link.mime_type || ''}
                      onChange={(e) => handleLinkChange(index, 'mime_type', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="image/jpeg, audio/mp3, video/mp4"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description (optional)
                    </label>
                    <textarea
                      value={link.description || ''}
                      onChange={(e) => handleLinkChange(index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="คำอธิบายเพิ่มเติม..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={link.is_primary}
                      onChange={(e) => handleLinkChange(index, 'is_primary', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Primary link</span>
                  </label>

                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/books"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Book'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditBookPageContent;
