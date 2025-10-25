# 🔧 แก้ไขปัญหา Supabase - โปรแกรมอ่านข้อมูลไม่ได้

## ❌ **ปัญหาที่พบ**
```
โปรแกรมอ่านข้อมูลจาก Supabase ไม่ได้
```

## 🔍 **สาเหตุของปัญหา**

1. **Environment variables ไม่ได้ตั้งค่า**
2. **Database tables ยังไม่ได้ถูกสร้าง**
3. **RLS (Row Level Security) ไม่อนุญาตให้เข้าถึง**
4. **API keys ไม่ถูกต้อง**

## ✅ **วิธีแก้ไข**

### **ขั้นตอนที่ 1: ตรวจสอบการตั้งค่า**

#### **1.1 ตรวจสอบ Environment Variables**

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `digital-library/`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=trlA+yCO07Z6xksDKFYI6gYDAXeoRdC5Zbz12sK9p/0=
```

#### **1.2 ตรวจสอบการเชื่อมต่อ**

ไปที่ `http://localhost:3000/api/test-supabase` เพื่อตรวจสอบการเชื่อมต่อ

### **ขั้นตอนที่ 2: ตั้งค่า Supabase**

#### **2.1 สร้าง Supabase Project**

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. คลิก **"New Project"**
3. เลือก Organization และตั้งชื่อ project
4. ตั้งรหัสผ่าน database
5. เลือก region (แนะนำ Singapore)
6. คลิก **"Create new project"**

#### **2.2 ตั้งค่า Environment Variables**

1. ไปที่ **Project Settings** > **API**
2. คัดลอก **Project URL** และ **anon public key**
3. ใส่ในไฟล์ `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### **ขั้นตอนที่ 3: สร้าง Database Tables**

#### **3.1 ไปที่ SQL Editor**

1. ไปที่ Supabase Dashboard
2. คลิก **"SQL Editor"** ในเมนูด้านซ้าย
3. คลิก **"New query"**

#### **3.2 รัน SQL Script**

คัดลอกและรัน SQL script จากไฟล์ `supabase-setup.sql`:

```sql
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

-- ตั้งค่า RLS (Row Level Security)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- สร้าง policies สำหรับการเข้าถึงข้อมูล
CREATE POLICY "Allow all access to books" ON books FOR ALL USING (true);
CREATE POLICY "Allow all access to book_links" ON book_links FOR ALL USING (true);
CREATE POLICY "Allow all access to categories" ON categories FOR ALL USING (true);
```

### **ขั้นตอนที่ 4: รีสตาร์ทเซิร์ฟเวอร์**

```bash
npm run dev
```

### **ขั้นตอนที่ 5: ทดสอบการทำงาน**

#### **5.1 ตรวจสอบ Database**
```
http://localhost:3000/api/test-supabase
```

#### **5.2 ตรวจสอบ Books API**
```
http://localhost:3000/api/books
```

#### **5.3 ตรวจสอบ Categories API**
```
http://localhost:3000/api/categories
```

#### **5.4 ตรวจสอบ Statistics**
```
http://localhost:3000/admin/statistics
```

## 🔧 **การแก้ไขเพิ่มเติม**

### **หากยังมีปัญหา:**

#### **1. ตรวจสอบ Supabase Dashboard:**
- Project เปิดใช้งานแล้ว
- Tables ถูกสร้างแล้ว
- API keys ถูกต้อง

#### **2. ตรวจสอบ Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### **3. ตรวจสอบ RLS Policies:**
- ไปที่ **Authentication** > **Policies**
- ตรวจสอบว่า policies ถูกสร้างแล้ว

#### **4. ตรวจสอบ Network:**
- Internet connection
- Firewall settings
- Proxy settings

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: supabaseUrl is required**

**สาเหตุ**: Environment variables ไม่ครบ

**วิธีแก้**:
1. ตรวจสอบไฟล์ `.env.local`
2. ตั้งค่า `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. รีสตาร์ทเซิร์ฟเวอร์

### **Error: Database connection failed**

**สาเหตุ**: Supabase project ไม่ถูกต้องหรือ tables ไม่มี

**วิธีแก้**:
1. ตรวจสอบ Supabase Dashboard
2. สร้าง tables ตาม SQL script
3. ตรวจสอบ API keys

### **Error: Tables not found**

**สาเหตุ**: Database tables ยังไม่ได้ถูกสร้าง

**วิธีแก้**:
1. ไปที่ Supabase Dashboard → SQL Editor
2. รัน SQL script ที่ให้ไว้
3. ตรวจสอบว่า tables ถูกสร้างแล้ว

### **Error: RLS Policy Error**

**สาเหตุ**: Row Level Security ไม่อนุญาตให้เข้าถึง

**วิธีแก้**:
1. ไปที่ **Authentication** > **Policies**
2. สร้าง policies สำหรับ tables ทั้งหมด
3. ตั้งค่าให้อนุญาตการเข้าถึง

## 📚 **ไฟล์ที่เกี่ยวข้อง**

- `src/lib/supabase.ts` - Supabase configuration
- `src/lib/supabase-simple.ts` - Database service
- `src/app/api/test-supabase/route.ts` - Debug API
- `supabase-setup.sql` - SQL script สำหรับสร้าง tables

## 🔗 **ลิงก์ที่มีประโยชน์**

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Environment Variables Guide](ENV_SETUP_GUIDE.md)

---

**หมายเหตุ**: ตรวจสอบ console logs เพื่อดู error details เพิ่มเติม
