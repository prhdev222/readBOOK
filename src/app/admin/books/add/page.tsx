'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface NewBook {
  title: string;
  author: string;
  description: string;
  category: string;
  language: string;
}

function AddBookPageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [book, setBook] = useState<NewBook>({
    title: '',
    author: '',
    description: '',
    category: '',
    language: 'ไทย'
  });

  const [links, setLinks] = useState([
    { 
      type: 'google_drive', 
      url: '', 
      title: 'Google Drive', 
      is_primary: true, 
      media_type: 'file',
      description: '',
      thumbnail_url: '',
      duration: 0,
      file_size: 0,
      mime_type: ''
    }
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

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
      type: 'google_drive', 
      url: '', 
      title: '', 
      is_primary: false, 
      media_type: 'file',
      description: '',
      thumbnail_url: '',
      duration: 0,
      file_size: 0,
      mime_type: ''
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

      // Insert book
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert([{
          title: book.title,
          author: book.author,
          description: book.description || null,
          category: book.category,
          language: book.language
        }])
        .select()
        .single();

      if (bookError) throw bookError;

      // Insert links
      const validLinks = links.filter(link => link.url && link.title);
      if (validLinks.length > 0) {
        const linksWithBookId = validLinks.map(link => ({
          ...link,
          book_id: bookData.id,
          is_active: true,
          description: link.description || null,
          thumbnail_url: link.thumbnail_url || null,
          duration: link.duration || null,
          file_size: link.file_size || null,
          mime_type: link.mime_type || null,
          collection_id: null
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
      console.error('Error adding book:', error);
      setError('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Added Successfully!</h2>
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
              <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
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
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddBookPageContent;