# 🚀 คู่มือ Deploy ไป Vercel

## 📋 **ขั้นตอนการ Deploy**

### **1. เตรียมโปรเจค**

#### **1.1 ตรวจสอบไฟล์ที่จำเป็น:**
- ✅ `package.json` - มี build scripts
- ✅ `next.config.js` - Next.js configuration
- ✅ `tailwind.config.js` - Tailwind CSS config
- ✅ `tsconfig.json` - TypeScript config
- ✅ `.env.local` - Environment variables (local only)

#### **1.2 สร้างไฟล์ `.env.example`:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### **2. Deploy ไป Vercel**

#### **วิธีที่ 1: ใช้ Vercel CLI (แนะนำ)**

1. **ติดตั้ง Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login เข้า Vercel:**
```bash
vercel login
```

3. **Deploy โปรเจค:**
```bash
vercel
```

4. **Follow prompts:**
   - Set up and deploy? `Y`
   - Which scope? เลือก account ของคุณ
   - Link to existing project? `N`
   - What's your project's name? `readbook-digital-library`
   - In which directory is your code located? `./`

#### **วิธีที่ 2: ใช้ Vercel Dashboard**

1. **ไปที่ [vercel.com](https://vercel.com)**
2. **Login เข้าบัญชี**
3. **คลิก "New Project"**
4. **Import Git Repository:**
   - เชื่อมต่อ GitHub/GitLab
   - เลือก repository
   - ตั้งค่า Environment Variables

### **3. ตั้งค่า Environment Variables**

ใน Vercel Dashboard:

1. **ไปที่ Project Settings**
2. **เลือก Environment Variables**
3. **เพิ่ม variables:**

```
NEXT_PUBLIC_SUPABASE_URL = https://ecwlspzmruvbklqbcsml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
NODE_ENV = production
```

### **4. ตั้งค่า Domain (Optional)**

1. **ไปที่ Project Settings**
2. **เลือก Domains**
3. **เพิ่ม Custom Domain:**
   - `readbook.yourdomain.com`
   - หรือใช้ Vercel domain: `your-app-name.vercel.app`

### **5. ตรวจสอบการ Deploy**

#### **5.1 ตรวจสอบ Build:**
- ไปที่ Vercel Dashboard
- ดู Build Logs
- ตรวจสอบว่า build สำเร็จ

#### **5.2 ตรวจสอบ Environment Variables:**
- ไปที่ Project Settings > Environment Variables
- ตรวจสอบว่าตั้งค่าถูกต้อง

#### **5.3 ทดสอบเว็บไซต์:**
- เปิด URL ที่ Vercel ให้
- ทดสอบการทำงานของเว็บไซต์
- ตรวจสอบการเชื่อมต่อ Supabase

### **6. ตั้งค่า Supabase สำหรับ Production**

#### **6.1 ตั้งค่า CORS:**
ใน Supabase Dashboard:
1. ไปที่ **Settings > API**
2. เพิ่ม Vercel domain ใน **Site URL:**
   ```
   https://your-app-name.vercel.app
   ```

#### **6.2 ตั้งค่า RLS Policies:**
ตรวจสอบว่า RLS policies ตั้งค่าถูกต้อง:
```sql
-- ตรวจสอบ policies
SELECT * FROM pg_policies WHERE tablename = 'books';
SELECT * FROM pg_policies WHERE tablename = 'book_links';
```

### **7. การอัปเดต**

#### **7.1 Auto Deploy:**
- Push code ไป GitHub
- Vercel จะ auto deploy ทันที

#### **7.2 Manual Deploy:**
```bash
vercel --prod
```

## 🎯 **หลัง Deploy เสร็จ**

### **สิ่งที่ต้องทำ:**
1. ✅ **ทดสอบเว็บไซต์** - ตรวจสอบการทำงาน
2. ✅ **ตั้งค่า Supabase** - CORS และ RLS
3. ✅ **ทดสอบการดาวน์โหลด** - ตรวจสอบไฟล์ PDF
4. ✅ **บันทึก URL** - สำหรับ LINE Mini App

### **URL ที่ได้:**
```
https://your-app-name.vercel.app
```

### **ขั้นตอนต่อไป:**
1. **ทดสอบเว็บไซต์** ให้ทำงานได้ปกติ
2. **ตั้งค่า LINE Mini App** (ขั้นตอนต่อไป)
3. **เพิ่ม LINE LIFF SDK** ในโปรเจค

## 🚨 **ปัญหาที่อาจเจอ:**

### **1. Build Error:**
- ตรวจสอบ TypeScript errors
- ตรวจสอบ dependencies
- ดู Build Logs ใน Vercel

### **2. Environment Variables:**
- ตรวจสอบชื่อ variables
- ตรวจสอบค่า Supabase credentials
- ตรวจสอบ NEXT_PUBLIC_ prefix

### **3. Supabase Connection:**
- ตรวจสอบ CORS settings
- ตรวจสอบ RLS policies
- ตรวจสอบ API keys

## 📞 **การแก้ไขปัญหา:**

หากมีปัญหา:
1. ดู Build Logs ใน Vercel Dashboard
2. ตรวจสอบ Environment Variables
3. ทดสอบ local development
4. ตรวจสอบ Supabase settings
