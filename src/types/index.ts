// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  publishedDate?: string;
  isbn?: string;
  language: string;
  pages?: number;
  fileSize?: string;
  // รองรับลิงก์หลายประเภท
  links: BookLink[];
  createdAt: string;
  updatedAt: string;
}

// ประเภทของลิงก์หนังสือ
export interface BookLink {
  id: string;
  type: 'google_drive' | 'dropbox' | 'onedrive' | 'mega' | 'mediafire' | 'direct' | 'other';
  url: string;
  title: string;
  description?: string;
  isPrimary: boolean; // ลิงก์หลัก
  isActive: boolean;
}

// หมวดหมู่หนังสือ
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  bookCount: number;
  createdAt: string;
  updatedAt: string;
}

// ผู้ใช้ (สำหรับระบบ Admin)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// การค้นหา
export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  tags?: string[];
  language?: string;
  sortBy?: 'title' | 'author' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// ผลการค้นหา
export interface SearchResult {
  books: Book[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: SearchFilters;
}

// การตั้งค่า
export interface AppSettings {
  siteName: string;
  siteDescription: string;
  allowRegistration: boolean;
  requireLogin: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  supportedLinkTypes: string[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
