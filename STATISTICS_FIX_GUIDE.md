# 🔧 แก้ไขปัญหา "เกิดข้อผิดพลาดในการโหลดข้อมูล" ในหน้า Statistics

## ❌ **ปัญหาที่พบ**
```
เกิดข้อผิดพลาดในการโหลดข้อมูล
```

## 🔍 **สาเหตุของปัญหา**

1. **Supabase configuration ไม่ได้ตั้งค่า**
2. **Database tables ยังไม่ได้ถูกสร้าง**
3. **Environment variables ไม่ครบ**
4. **Network connection issues**

## ✅ **วิธีแก้ไข**

### **ขั้นตอนที่ 1: ตรวจสอบการตั้งค่า**

ไปที่ `http://localhost:3000/api/debug-database` เพื่อตรวจสอบการตั้งค่า

### **ขั้นตอนที่ 2: ตั้งค่า Supabase**

#### **2.1 สร้าง Supabase Project**

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. คลิก **"New Project"**
3. เลือก Organization และตั้งชื่อ project
4. ตั้งรหัสผ่าน database
5. เลือก region (แนะนำ Singapore)
6. คลิก **"Create new project"**

#### **2.2 ตั้งค่า Environment Variables**

เพิ่มในไฟล์ `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### **2.3 สร้าง Database Tables**

ไปที่ Supabase Dashboard → SQL Editor และรัน SQL นี้:

```sql
-- สร้างตาราง books
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_date DATE,
  isbn TEXT,
  language TEXT DEFAULT 'th',
  pages INTEGER,
  file_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง book_links
CREATE TABLE book_links (
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
CREATE TABLE categories (
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
('อื่นๆ', '#6B7280', '📄');

-- สร้าง indexes
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_created_at ON books(created_at);
CREATE INDEX idx_book_links_book_id ON book_links(book_id);
CREATE INDEX idx_book_links_type ON book_links(type);
```

### **ขั้นตอนที่ 3: รีสตาร์ทเซิร์ฟเวอร์**

```bash
npm run dev
```

### **ขั้นตอนที่ 4: ทดสอบการทำงาน**

1. **ตรวจสอบ Database**: `http://localhost:3000/api/debug-database`
2. **ทดสอบ Statistics**: `http://localhost:3000/admin/statistics`

## 🔧 **การแก้ไขเพิ่มเติม**

### **หากยังมีปัญหา:**

1. **ตรวจสอบ Supabase Dashboard:**
   - Project เปิดใช้งานแล้ว
   - Tables ถูกสร้างแล้ว
   - API keys ถูกต้อง

2. **ตรวจสอบ Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **ตรวจสอบ Network:**
   - Internet connection
   - Firewall settings
   - Proxy settings

### **หากต้องการใช้ Database อื่น:**

1. **SQLite (Local):**
   - ใช้ไฟล์ `supabase-simple.sql`
   - ไม่ต้องตั้งค่า Supabase

2. **PostgreSQL (Local):**
   - ติดตั้ง PostgreSQL
   - ตั้งค่า connection string

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: Supabase configuration is missing**

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

## 📚 **ไฟล์ที่เกี่ยวข้อง**

- `src/app/api/statistics/route.ts` - Statistics API
- `src/app/api/debug-database/route.ts` - Database debug
- `src/lib/supabase-simple.ts` - Database service
- `src/lib/supabase.ts` - Supabase configuration

## 🔗 **ลิงก์ที่มีประโยชน์**

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Documentation](https://supabase.com/docs)
- [Environment Variables Guide](ENV_SETUP_GUIDE.md)

---

**หมายเหตุ**: ตรวจสอบ console logs เพื่อดู error details เพิ่มเติม
