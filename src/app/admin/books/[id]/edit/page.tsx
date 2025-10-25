'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    checkAuth();
    loadBook();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index: number, field: string, value: string | boolean) => {
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

      // Update book
      const { error: bookError } = await supabase
        .from('books')
        .update({
          title: book.title,
          author: book.author,
          description: book.description || null,
          category: book.category,
          language: book.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookId);

      if (bookError) throw bookError;

      // Handle links - delete existing and insert new ones
      const { error: deleteError } = await supabase
        .from('book_links')
        .delete()
        .eq('book_id', bookId);

      if (deleteError) throw deleteError;

      // Insert new links
      const validLinks = links.filter(link => link.url && link.title);
      if (validLinks.length > 0) {
        const linksWithBookId = validLinks.map(link => ({
          book_id: bookId,
          type: link.type,
          url: link.url,
          title: link.title,
          is_primary: link.is_primary,
          is_active: true
        }));

        const { error: linksError } = await supabase
          .from('book_links')
          .insert(linksWithBookId);

        if (linksError) throw linksError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/books');
      }, 2000);

    } catch (error) {
      console.error('Error updating book:', error);
      setError('Failed to update book');
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={book.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="เทคโนโลยี">เทคโนโลยี</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="การเงิน">การเงิน</option>
                  <option value="สุขภาพ">สุขภาพ</option>
                  <option value="การศึกษา">การศึกษา</option>
                  <option value="ธุรกิจ">ธุรกิจ</option>
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
                      <option value="google_drive">Google Drive</option>
                      <option value="dropbox">Dropbox</option>
                      <option value="onedrive">OneDrive</option>
                      <option value="mega">MEGA</option>
                      <option value="mediafire">MediaFire</option>
                      <option value="direct">Direct Link</option>
                      <option value="other">Other</option>
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

                  <div className="md:col-span-2">
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
