import { supabase } from './supabase';
import { Book, BookLink, Category } from '@/types';

// Simple Supabase Database Service - เหมาะสำหรับ Free Tier
export class SupabaseSimpleDatabase {
  
  // ========== BOOK METHODS ==========
  
  // ดึงหนังสือทั้งหมด
  async getAllBooks(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_links (
          id,
          type,
          url,
          title,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
      return [];
    }

    return data?.map(this.transformBook) || [];
  }

  // ดึงหนังสือตาม ID
  async getBookById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_links (
          id,
          type,
          url,
          title,
          is_primary
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching book:', error);
      return null;
    }
    
    return this.transformBook(data);
  }

  // ค้นหาหนังสือ
  async searchBooks(query: string, category?: string): Promise<Book[]> {
    let supabaseQuery = supabase
      .from('books')
      .select(`
        *,
        book_links (
          id,
          type,
          url,
          title,
          is_primary
        )
      `);

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%`);
    }

    if (category && category !== 'all') {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching books:', error);
      return [];
    }
    
    return data?.map(this.transformBook) || [];
  }

  // เพิ่มหนังสือใหม่
  async addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        language: book.language
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding book:', error);
      return null;
    }

    // เพิ่มลิงก์หากมี
    if (book.links && book.links.length > 0) {
      const linkInserts = book.links.map(link => ({
        book_id: data.id,
        type: link.type,
        url: link.url,
        title: link.title,
        is_primary: link.isPrimary
      }));

      await supabase.from('book_links').insert(linkInserts);
    }

    return this.transformBook(data);
  }

  // อัปเดตหนังสือ
  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .update({
        title: updates.title,
        author: updates.author,
        description: updates.description,
        category: updates.category,
        language: updates.language
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating book:', error);
      return null;
    }
    
    return this.transformBook(data);
  }

  // ลบหนังสือ
  async deleteBook(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting book:', error);
      return false;
    }
    
    return true;
  }

  // ========== LINK METHODS ==========

  // เพิ่มลิงก์ให้หนังสือ
  async addLinkToBook(bookId: string, link: Omit<BookLink, 'id'>): Promise<BookLink | null> {
    const { data, error } = await supabase
      .from('book_links')
      .insert({
        book_id: bookId,
        type: link.type,
        url: link.url,
        title: link.title,
        is_primary: link.isPrimary
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding link:', error);
      return null;
    }

    return {
      id: data.id,
      type: data.type,
      url: data.url,
      title: data.title,
      description: '',
      isPrimary: data.is_primary,
      isActive: true
    };
  }

  // อัปเดตลิงก์
  async updateLink(linkId: string, updates: Partial<BookLink>): Promise<BookLink | null> {
    const { data, error } = await supabase
      .from('book_links')
      .update({
        type: updates.type,
        url: updates.url,
        title: updates.title,
        is_primary: updates.isPrimary
      })
      .eq('id', linkId)
      .select()
      .single();

    if (error) {
      console.error('Error updating link:', error);
      return null;
    }

    return {
      id: data.id,
      type: data.type,
      url: data.url,
      title: data.title,
      description: '',
      isPrimary: data.is_primary,
      isActive: true
    };
  }

  // ลบลิงก์
  async deleteLink(linkId: string): Promise<boolean> {
    const { error } = await supabase
      .from('book_links')
      .delete()
      .eq('id', linkId);

    if (error) {
      console.error('Error deleting link:', error);
      return false;
    }
    
    return true;
  }

  // ดึงลิงก์ทั้งหมดของหนังสือ
  async getBookLinks(bookId: string): Promise<BookLink[]> {
    const { data, error } = await supabase
      .from('book_links')
      .select('*')
      .eq('book_id', bookId)
      .order('is_primary', { ascending: false });

    if (error) {
      console.error('Error fetching book links:', error);
      return [];
    }

    return data?.map(link => ({
      id: link.id,
      type: link.type,
      url: link.url,
      title: link.title,
      description: '',
      isPrimary: link.is_primary,
      isActive: true
    })) || [];
  }

  // ========== CATEGORY METHODS ==========

  // ดึงหมวดหมู่ทั้งหมด
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data?.map(this.transformCategory) || [];
  }

  // เพิ่มหมวดหมู่ใหม่
  async addCategory(category: Omit<Category, 'id' | 'bookCount' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        color: category.color,
        icon: category.icon
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return null;
    }
    
    return this.transformCategory(data);
  }

  // อัปเดตหมวดหมู่
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        color: updates.color,
        icon: updates.icon
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }
    
    return this.transformCategory(data);
  }

  // ลบหมวดหมู่
  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    
    return true;
  }

  // ========== STATISTICS ==========

  // สถิติระบบแบบง่าย
  async getStatistics() {
    try {
      const [booksResult, linksResult, categoriesResult] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact' }),
        supabase.from('book_links').select('type', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' })
      ]);

      // สถิติประเภทลิงก์
      const { data: linkTypes } = await supabase
        .from('book_links')
        .select('type');

      const linkTypeStats: Record<string, number> = {};
      linkTypes?.forEach(link => {
        linkTypeStats[link.type] = (linkTypeStats[link.type] || 0) + 1;
      });

      // หนังสือล่าสุด
      const { data: recentBooks } = await supabase
        .from('books')
        .select('id, title, author, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalBooks: booksResult.count || 0,
        totalLinks: linksResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        linkTypes: linkTypeStats,
        recentBooks: recentBooks || []
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalBooks: 0,
        totalLinks: 0,
        totalCategories: 0,
        linkTypes: {},
        recentBooks: []
      };
    }
  }

  // ========== HELPER METHODS ==========

  // แปลงข้อมูลจาก Supabase เป็น Book
  private transformBook(data: any): Book {
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      description: data.description || '',
      coverImage: '',
      category: data.category,
      tags: [],
      publishedDate: '',
      isbn: '',
      language: data.language,
      pages: 0,
      fileSize: '',
      links: data.book_links?.map((link: any) => ({
        id: link.id,
        type: link.type,
        url: link.url,
        title: link.title,
        description: '',
        isPrimary: link.is_primary,
        isActive: true
      })) || [],
      createdAt: data.created_at,
      updatedAt: data.created_at
    };
  }

  // แปลงข้อมูลจาก Supabase เป็น Category
  private transformCategory(data: any): Category {
    return {
      id: data.id,
      name: data.name,
      description: '',
      color: data.color,
      icon: data.icon,
      bookCount: 0,
      createdAt: data.created_at,
      updatedAt: data.created_at
    };
  }
}

// สร้าง instance ของ Supabase Simple Database
export const supabaseSimpleDb = new SupabaseSimpleDatabase();
