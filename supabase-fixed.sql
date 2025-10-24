-- Supabase Fixed Migration - แก้ไขปัญหา text search configuration
-- ใช้ memory น้อย เหมาะสำหรับ Supabase Free Plan

-- สร้างตาราง books
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  language VARCHAR(50) DEFAULT 'ไทย',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง book_links
CREATE TABLE IF NOT EXISTS book_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('google_drive', 'dropbox', 'onedrive', 'mega', 'mediafire', 'direct', 'other')),
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(10) DEFAULT '📚',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง Indexes พื้นฐาน
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_book_links_book_id ON book_links(book_id);
CREATE INDEX IF NOT EXISTS idx_book_links_type ON book_links(type);

-- สร้าง Full Text Search Index (ใช้ 'simple' configuration - รองรับทุกภาษา)
CREATE INDEX IF NOT EXISTS idx_books_search ON books USING gin(to_tsvector('simple', title || ' ' || author || ' ' || COALESCE(description, '')));

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- สร้าง Policies แบบง่าย - ให้ทุกคนอ่านได้
CREATE POLICY "Allow public read access" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON book_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);

-- สร้าง Policies สำหรับ Admin (ใช้ service role key)
CREATE POLICY "Allow admin full access" ON books FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON book_links FOR ALL USING (true);
CREATE POLICY "Allow admin full access" ON categories FOR ALL USING (true);

-- เพิ่มข้อมูลหมวดหมู่เริ่มต้น
INSERT INTO categories (name, color, icon) VALUES
('เทคโนโลยี', '#3B82F6', '💻'),
('AI & Data Science', '#10B981', '🤖'),
('การเงิน', '#F59E0B', '💰'),
('สุขภาพ', '#EF4444', '🏥'),
('การศึกษา', '#8B5CF6', '📚'),
('ธุรกิจ', '#06B6D4', '💼')
ON CONFLICT (name) DO NOTHING;

-- เพิ่มข้อมูลหนังสือตัวอย่าง
INSERT INTO books (title, author, description, category, language) VALUES
('การเขียนโปรแกรม Python', 'ดร.สมชาย ใจดี', 'หนังสือสอนการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น', 'เทคโนโลยี', 'ไทย'),
('Machine Learning Fundamentals', 'Dr. Jane Smith', 'A comprehensive guide to machine learning concepts and applications', 'AI & Data Science', 'English'),
('การลงทุนในหุ้น', 'คุณสมศรี ใจดี', 'คู่มือการลงทุนในตลาดหุ้นสำหรับผู้เริ่มต้น', 'การเงิน', 'ไทย');

-- เพิ่มลิงก์ตัวอย่าง
INSERT INTO book_links (book_id, type, url, title, is_primary) 
SELECT 
    b.id,
    'google_drive',
    'https://drive.google.com/file/d/example1/view',
    'Google Drive',
    true
FROM books b WHERE b.title = 'การเขียนโปรแกรม Python';

INSERT INTO book_links (book_id, type, url, title, is_primary) 
SELECT 
    b.id,
    'dropbox',
    'https://dropbox.com/s/example2/file.pdf',
    'Dropbox',
    false
FROM books b WHERE b.title = 'การเขียนโปรแกรม Python';
