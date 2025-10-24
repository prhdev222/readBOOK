import { Book, Category, BookLink } from '@/types';

// ฐานข้อมูลจำลอง (ในโปรเจคจริงจะใช้ PostgreSQL, MongoDB หรือฐานข้อมูลอื่น)
class Database {
  private books: Book[] = [];
  private categories: Category[] = [];
  private bookLinks: BookLink[] = [];

  constructor() {
    this.initializeData();
  }

  // เริ่มต้นข้อมูลตัวอย่าง
  private initializeData() {
    // หมวดหมู่ตัวอย่าง
    this.categories = [
      {
        id: '1',
        name: 'เทคโนโลยี',
        description: 'หนังสือเกี่ยวกับเทคโนโลยีและการเขียนโปรแกรม',
        color: '#3B82F6',
        icon: '💻',
        bookCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'AI & Data Science',
        description: 'ปัญญาประดิษฐ์และวิทยาศาสตร์ข้อมูล',
        color: '#10B981',
        icon: '🤖',
        bookCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'การเงิน',
        description: 'หนังสือเกี่ยวกับการเงินและการลงทุน',
        color: '#F59E0B',
        icon: '💰',
        bookCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // หนังสือตัวอย่าง
    this.books = [
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
        fileSize: '15.2 MB',
        links: [],
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
        fileSize: '25.8 MB',
        links: [],
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-01T10:00:00Z'
      }
    ];

    // ลิงก์ตัวอย่าง
    this.bookLinks = [
      // ลิงก์สำหรับหนังสือ Python
      {
        id: 'link1',
        type: 'google_drive',
        url: 'https://drive.google.com/file/d/1ABC123DEF456GHI789JKL/view',
        title: 'Google Drive',
        description: 'ไฟล์ PDF คุณภาพสูง',
        isPrimary: true,
        isActive: true
      },
      {
        id: 'link2',
        type: 'dropbox',
        url: 'https://dropbox.com/s/xyz789abc123def456/file.pdf',
        title: 'Dropbox',
        description: 'สำรอง - ไฟล์เดียวกัน',
        isPrimary: false,
        isActive: true
      },
      // ลิงก์สำหรับหนังสือ Machine Learning
      {
        id: 'link3',
        type: 'onedrive',
        url: 'https://1drv.ms/b/s!ABC123DEF456GHI789JKL',
        title: 'OneDrive',
        description: 'ไฟล์หลัก',
        isPrimary: true,
        isActive: true
      },
      {
        id: 'link4',
        type: 'mega',
        url: 'https://mega.nz/file/xyz789abc123def456',
        title: 'MEGA',
        description: 'สำรอง - เข้ารหัส',
        isPrimary: false,
        isActive: true
      }
    ];

    // เชื่อมโยงลิงก์กับหนังสือ
    this.books[0].links = [this.bookLinks[0], this.bookLinks[1]];
    this.books[1].links = [this.bookLinks[2], this.bookLinks[3]];
  }

  // ========== BOOK METHODS ==========
  
  // ดึงหนังสือทั้งหมด
  getAllBooks(): Book[] {
    return this.books;
  }

  // ดึงหนังสือตาม ID
  getBookById(id: string): Book | null {
    return this.books.find(book => book.id === id) || null;
  }

  // ค้นหาหนังสือ
  searchBooks(query: string, category?: string): Book[] {
    let filteredBooks = this.books;

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        book.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (category && category !== 'all') {
      filteredBooks = filteredBooks.filter(book => book.category === category);
    }

    return filteredBooks;
  }

  // เพิ่มหนังสือใหม่
  addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Book {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.books.push(newBook);
    return newBook;
  }

  // อัปเดตหนังสือ
  updateBook(id: string, updates: Partial<Book>): Book | null {
    const index = this.books.findIndex(book => book.id === id);
    if (index === -1) return null;

    this.books[index] = {
      ...this.books[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.books[index];
  }

  // ลบหนังสือ
  deleteBook(id: string): boolean {
    const index = this.books.findIndex(book => book.id === id);
    if (index === -1) return false;

    // ลบลิงก์ที่เกี่ยวข้อง
    this.bookLinks = this.bookLinks.filter(link => 
      !this.books[index].links.some(bookLink => bookLink.id === link.id)
    );

    this.books.splice(index, 1);
    return true;
  }

  // ========== LINK METHODS ==========

  // เพิ่มลิงก์ให้หนังสือ
  addLinkToBook(bookId: string, link: Omit<BookLink, 'id'>): BookLink | null {
    const book = this.getBookById(bookId);
    if (!book) return null;

    const newLink: BookLink = {
      ...link,
      id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // เพิ่มลิงก์ในฐานข้อมูล
    this.bookLinks.push(newLink);
    
    // เพิ่มลิงก์ให้หนังสือ
    book.links.push(newLink);
    book.updatedAt = new Date().toISOString();

    return newLink;
  }

  // อัปเดตลิงก์
  updateLink(linkId: string, updates: Partial<BookLink>): BookLink | null {
    const linkIndex = this.bookLinks.findIndex(link => link.id === linkId);
    if (linkIndex === -1) return null;

    this.bookLinks[linkIndex] = {
      ...this.bookLinks[linkIndex],
      ...updates
    };

    // อัปเดตในหนังสือที่เกี่ยวข้อง
    this.books.forEach(book => {
      const bookLinkIndex = book.links.findIndex(link => link.id === linkId);
      if (bookLinkIndex !== -1) {
        book.links[bookLinkIndex] = this.bookLinks[linkIndex];
        book.updatedAt = new Date().toISOString();
      }
    });

    return this.bookLinks[linkIndex];
  }

  // ลบลิงก์
  deleteLink(linkId: string): boolean {
    const linkIndex = this.bookLinks.findIndex(link => link.id === linkId);
    if (linkIndex === -1) return false;

    // ลบจากฐานข้อมูล
    this.bookLinks.splice(linkIndex, 1);

    // ลบจากหนังสือที่เกี่ยวข้อง
    this.books.forEach(book => {
      const bookLinkIndex = book.links.findIndex(link => link.id === linkId);
      if (bookLinkIndex !== -1) {
        book.links.splice(bookLinkIndex, 1);
        book.updatedAt = new Date().toISOString();
      }
    });

    return true;
  }

  // ดึงลิงก์ทั้งหมดของหนังสือ
  getBookLinks(bookId: string): BookLink[] {
    const book = this.getBookById(bookId);
    return book ? book.links : [];
  }

  // ========== CATEGORY METHODS ==========

  // ดึงหมวดหมู่ทั้งหมด
  getAllCategories(): Category[] {
    return this.categories;
  }

  // เพิ่มหมวดหมู่ใหม่
  addCategory(category: Omit<Category, 'id' | 'bookCount' | 'createdAt' | 'updatedAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      bookCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.categories.push(newCategory);
    return newCategory;
  }

  // ========== STATISTICS ==========

  // สถิติระบบ
  getStatistics() {
    return {
      totalBooks: this.books.length,
      totalLinks: this.bookLinks.length,
      totalCategories: this.categories.length,
      linkTypes: this.getLinkTypeStatistics(),
      recentBooks: this.books
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    };
  }

  // สถิติประเภทลิงก์
  private getLinkTypeStatistics() {
    const stats: Record<string, number> = {};
    this.bookLinks.forEach(link => {
      stats[link.type] = (stats[link.type] || 0) + 1;
    });
    return stats;
  }
}

// สร้าง instance เดียวของฐานข้อมูล
export const db = new Database();
