-- สร้างตาราง books
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_date DATE,
  isbn TEXT,
  language TEXT DEFAULT 'ไทย',
  pages INTEGER,
  file_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง book_links
CREATE TABLE IF NOT EXISTS book_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('google_drive', 'dropbox', 'onedrive', 'mega', 'mediafire', 'direct', 'other')),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT '📚',
  book_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- เพิ่มข้อมูลหมวดหมู่เริ่มต้น
INSERT INTO categories (name, color, icon) VALUES
('นิยาย', '#EF4444', '📖'),
('การ์ตูน', '#F59E0B', '🎨'),
('หนังสือเรียน', '#10B981', '📚'),
('เทคโนโลยี', '#3B82F6', '💻'),
('ธุรกิจ', '#8B5CF6', '💼'),
('สุขภาพ', '#EC4899', '🏥'),
('อื่นๆ', '#6B7280', '📄')
ON CONFLICT (name) DO NOTHING;

-- เพิ่มข้อมูลหนังสือตัวอย่าง
INSERT INTO books (title, author, description, category, language) VALUES
('การเขียนโปรแกรม Python', 'สมชาย ใจดี', 'หนังสือสอนการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น', 'เทคโนโลยี', 'ไทย'),
('นิยายรัก', 'สมหญิง สวยงาม', 'นิยายรักโรแมนติกที่อ่านแล้วติดใจ', 'นิยาย', 'ไทย'),
('การ์ตูนผจญภัย', 'นักเขียนการ์ตูน', 'การ์ตูนผจญภัยที่สนุกและน่าติดตาม', 'การ์ตูน', 'ไทย'),
('คู่มือการทำธุรกิจ', 'นักธุรกิจมืออาชีพ', 'คู่มือการเริ่มต้นธุรกิจสำหรับผู้ที่สนใจ', 'ธุรกิจ', 'ไทย'),
('สุขภาพดีด้วยตนเอง', 'หมอผู้เชี่ยวชาญ', 'คู่มือการดูแลสุขภาพด้วยตนเอง', 'สุขภาพ', 'ไทย')
ON CONFLICT DO NOTHING;

-- เพิ่มลิงก์ตัวอย่าง
INSERT INTO book_links (book_id, type, url, title, is_primary) 
SELECT 
  b.id,
  'google_drive',
  'https://drive.google.com/file/d/example1/view',
  'ลิงก์หลัก',
  true
FROM books b 
WHERE b.title = 'การเขียนโปรแกรม Python'
ON CONFLICT DO NOTHING;

-- สร้าง indexes
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_book_links_book_id ON book_links(book_id);
CREATE INDEX IF NOT EXISTS idx_book_links_type ON book_links(type);

-- ตั้งค่า RLS (Row Level Security) - เปิดให้ทุกคนเข้าถึงได้
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- สร้าง policies สำหรับการเข้าถึงข้อมูล
CREATE POLICY "Allow all access to books" ON books FOR ALL USING (true);
CREATE POLICY "Allow all access to book_links" ON book_links FOR ALL USING (true);
CREATE POLICY "Allow all access to categories" ON categories FOR ALL USING (true);
