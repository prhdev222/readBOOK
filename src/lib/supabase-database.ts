import { supabase } from './supabase';
import { Book, BookLink, Category } from '@/types';

// Supabase Database Service
export class SupabaseDatabase {
  
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
          description,
          is_primary,
          is_active
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

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
          description,
          is_primary,
          is_active
        )
      `)
      .eq('id', id)
      .single();

    if (error) return null;
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
          description,
          is_primary,
          is_active
        )
      `);

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%`);
    }

    if (category && category !== 'all') {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(this.transformBook) || [];
  }

  // เพิ่มหนังสือใหม่
  async addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: book.title,
        author: book.author,
        description: book.description,
        cover_image: book.coverImage,
        category: book.category,
        tags: book.tags,
        published_date: book.publishedDate,
        isbn: book.isbn,
        language: book.language,
        pages: book.pages,
        file_size: book.fileSize
      })
      .select()
      .single();

    if (error) throw error;

    // เพิ่มลิงก์หากมี
    if (book.links && book.links.length > 0) {
      const linkInserts = book.links.map(link => ({
        book_id: data.id,
        type: link.type,
        url: link.url,
        title: link.title,
        description: link.description,
        is_primary: link.isPrimary,
        is_active: link.isActive
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
        cover_image: updates.coverImage,
        category: updates.category,
        tags: updates.tags,
        published_date: updates.publishedDate,
        isbn: updates.isbn,
        language: updates.language,
        pages: updates.pages,
        file_size: updates.fileSize,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    return this.transformBook(data);
  }

  // ลบหนังสือ
  async deleteBook(id: string): Promise<boolean> {
    // ลบลิงก์ที่เกี่ยวข้องก่อน
    await supabase.from('book_links').delete().eq('book_id', id);

    // ลบหนังสือ
    const { error } = await supabase.from('books').delete().eq('id', id);
    return !error;
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
        description: link.description,
        is_primary: link.isPrimary,
        is_active: link.isActive
      })
      .select()
      .single();

    if (error) return null;

    return {
      id: data.id,
      type: data.type,
      url: data.url,
      title: data.title,
      description: data.description,
      isPrimary: data.is_primary,
      isActive: data.is_active
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
        description: updates.description,
        is_primary: updates.isPrimary,
        is_active: updates.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', linkId)
      .select()
      .single();

    if (error) return null;

    return {
      id: data.id,
      type: data.type,
      url: data.url,
      title: data.title,
      description: data.description,
      isPrimary: data.is_primary,
      isActive: data.is_active
    };
  }

  // ลบลิงก์
  async deleteLink(linkId: string): Promise<boolean> {
    const { error } = await supabase
      .from('book_links')
      .delete()
      .eq('id', linkId);

    return !error;
  }

  // ดึงลิงก์ทั้งหมดของหนังสือ
  async getBookLinks(bookId: string): Promise<BookLink[]> {
    const { data, error } = await supabase
      .from('book_links')
      .select('*')
      .eq('book_id', bookId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false });

    if (error) throw error;

    return data?.map(link => ({
      id: link.id,
      type: link.type,
      url: link.url,
      title: link.title,
      description: link.description,
      isPrimary: link.is_primary,
      isActive: link.is_active
    })) || [];
  }

  // ========== CATEGORY METHODS ==========

  // ดึงหมวดหมู่ทั้งหมด
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data?.map(this.transformCategory) || [];
  }

  // เพิ่มหมวดหมู่ใหม่
  async addCategory(category: Omit<Category, 'id' | 'bookCount' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon
      })
      .select()
      .single();

    if (error) throw error;
    return this.transformCategory(data);
  }

  // ========== STATISTICS ==========

  // สถิติระบบ
  async getStatistics() {
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
  }

  // ========== HELPER METHODS ==========

  // แปลงข้อมูลจาก Supabase เป็น Book
  private transformBook(data: any): Book {
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      description: data.description,
      coverImage: data.cover_image,
      category: data.category,
      tags: data.tags || [],
      publishedDate: data.published_date,
      isbn: data.isbn,
      language: data.language,
      pages: data.pages,
      fileSize: data.file_size,
      links: data.book_links?.map((link: any) => ({
        id: link.id,
        type: link.type,
        url: link.url,
        title: link.title,
        description: link.description,
        isPrimary: link.is_primary,
        isActive: link.is_active
      })) || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // แปลงข้อมูลจาก Supabase เป็น Category
  private transformCategory(data: any): Category {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      color: data.color,
      icon: data.icon,
      bookCount: data.book_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}

// สร้าง instance ของ Supabase Database
export const supabaseDb = new SupabaseDatabase();
