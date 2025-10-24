# 🚀 คู่มือการตั้งค่า readBOOK

## 📋 ขั้นตอนการตั้งค่า

### 1. เปิดเว็บเซิร์ฟเวอร์
```bash
cd "C:\Users\urare\OneDrive\Desktop\readBOOK\digital-library"
npm run dev
```
เว็บไซต์จะเปิดที่: `http://localhost:3000`

### 2. ตั้งค่า Supabase

#### 2.1 สร้างบัญชี Supabase
1. ไปที่ [supabase.com](https://supabase.com)
2. คลิก "Start your project"
3. สร้างบัญชี (ใช้ GitHub, Google หรือ Email)
4. สร้างโปรเจคใหม่

#### 2.2 ดูค่า API Keys
1. ไปที่ **Project Settings** (ไอคอนเฟือง)
2. เลือก **API** ในเมนูซ้าย
3. คัดลอกค่า:
   - **Project URL** (เช่น: `https://abcdefgh.supabase.co`)
   - **anon public** key (ยาวๆ)

#### 2.3 ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ `digital-library`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### 2.4 สร้างฐานข้อมูล
1. ไปที่ **SQL Editor** ใน Supabase Dashboard
2. ใช้ไฟล์ `supabase-fixed.sql`
3. คัดลอกโค้ดทั้งหมดและรัน

### 3. ตั้งค่า Google Drive API

#### 3.1 สร้าง Google Cloud Project
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้างโปรเจคใหม่
3. เปิดใช้งาน Google Drive API

#### 3.2 สร้าง Service Account
1. ไปที่ **IAM & Admin** → **Service Accounts**
2. คลิก **Create Service Account**
3. ตั้งชื่อ: `readbook-service`
4. สร้าง JSON key และดาวน์โหลด

#### 3.3 แชร์ Google Drive Folder
1. สร้างโฟลเดอร์ใน Google Drive
2. แชร์โฟลเดอร์กับ Service Account email
3. ตั้งค่าเป็น "Editor"

#### 3.4 เพิ่ม Environment Variables
เพิ่มในไฟล์ `.env.local`:

```bash
# Google Drive API
GOOGLE_DRIVE_API_KEY=your_api_key_here
GOOGLE_DRIVE_CLIENT_EMAIL=service_account_email@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=your_folder_id_here
```

### 4. ทดสอบการเชื่อมต่อ

#### 4.1 ทดสอบ Supabase
1. เปิด `http://localhost:3000`
2. ไปที่ `/admin/statistics`
3. ดูว่าข้อมูลแสดงหรือไม่

#### 4.2 ทดสอบ Google Drive
1. ไปที่ `/admin/books`
2. ลองเพิ่มหนังสือใหม่
3. ตรวจสอบว่าไฟล์อัปโหลดไป Google Drive

## 🔧 การแก้ไขปัญหา

### ปัญหา: "Missing script: dev"
**วิธีแก้:**
```bash
cd "C:\Users\urare\OneDrive\Desktop\readBOOK\digital-library"
npm run dev
```

### ปัญหา: Supabase connection failed
**วิธีแก้:**
1. ตรวจสอบ `.env.local` ว่ามี URL และ Key ถูกต้อง
2. ตรวจสอบว่า Supabase project ยังใช้งานได้
3. รีสตาร์ทเซิร์ฟเวอร์

### ปัญหา: Google Drive upload failed
**วิธีแก้:**
1. ตรวจสอบ Service Account JSON key
2. ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account แล้ว
3. ตรวจสอบ Folder ID ถูกต้อง

## 📱 ฟีเจอร์ที่ใช้งานได้

### สำหรับผู้ใช้ทั่วไป:
- ✅ ดูหนังสือทั้งหมด
- ✅ ค้นหาหนังสือ
- ✅ อ่านหนังสือ
- ✅ ดาวน์โหลดจากลิงก์ต่างๆ

### สำหรับ Admin:
- ✅ จัดการหนังสือ
- ✅ เพิ่ม/แก้ไข/ลบหนังสือ
- ✅ จัดการลิงก์หลายประเภท
- ✅ ดูสถิติระบบ
- ✅ อัปโหลดไฟล์ไป Google Drive

## 🔗 ลิงก์สำคัญ

- **เว็บไซต์:** `http://localhost:3000`
- **Admin:** `http://localhost:3000/admin/books`
- **สถิติ:** `http://localhost:3000/admin/statistics`
- **Supabase:** [supabase.com](https://supabase.com)
- **Google Cloud:** [console.cloud.google.com](https://console.cloud.google.com)

## 📞 การสนับสนุน

หากมีปัญหาหรือคำถาม:
1. ตรวจสอบ Console ในเบราว์เซอร์ (F12)
2. ดู Terminal output
3. ตรวจสอบ Supabase Dashboard
4. ตรวจสอบ Google Cloud Console
