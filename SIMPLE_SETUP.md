# readBOOK - ระบบห้องสมุดดิจิทัลแบบง่าย

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` จาก `env.example`:

```bash
cp env.example .env.local
```

แก้ไขไฟล์ `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Credentials (เปลี่ยนเป็นค่าที่ปลอดภัย)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Google Drive Configuration (Service Account)
GOOGLE_DRIVE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=your_google_drive_folder_id_here
```

### 3. รัน Development Server
```bash
npm run dev
```

## การใช้งาน

### สำหรับผู้ใช้ทั่วไป
- เข้าไปที่ `http://localhost:3000`
- อ่านหนังสือได้ทันทีโดยไม่ต้องลงทะเบียน
- ค้นหาหนังสือได้จากหน้า "หนังสือทั้งหมด"
- เข้าถึงหน้า reader ได้โดยตรง

### สำหรับ Admin
- เข้าไปที่ `http://localhost:3000/admin`
- ใช้ username/password ที่ตั้งไว้ใน `.env.local`
- จัดการหนังสือ หมวดหมู่ และดูสถิติได้

## ฟีเจอร์หลัก

### ✅ ฟีเจอร์ที่ใช้งานได้
- อ่านหนังสือโดยไม่ต้อง login
- ค้นหาหนังสือ
- จัดหมวดหมู่หนังสือ
- ระบบ Admin แบบง่าย
- รองรับลิงก์ดาวน์โหลดหลายประเภท
- อัปโหลดไฟล์ไปยัง Google Drive
- จัดการไฟล์ใน Google Drive

### ❌ ฟีเจอร์ที่ถูกลบออก
- ระบบ login ด้วย Google
- ระบบ login ด้วย LINE
- ระบบ NextAuth
- ระบบ LIFF
- ระบบ Google Drive integration

## โครงสร้างไฟล์

```
src/
├── app/
│   ├── admin/           # หน้า Admin
│   │   ├── login/      # หน้า Login Admin
│   │   ├── books/      # จัดการหนังสือ
│   │   └── ...
│   ├── books/          # หน้าหนังสือทั้งหมด
│   ├── reader/         # หน้าอ่านหนังสือ
│   └── api/            # API Routes
├── lib/
│   ├── admin-auth.ts   # ระบบ Auth แบบง่าย
│   └── ...
└── components/         # Components
```

## การ Deploy

### Vercel
```bash
npm run deploy
```

### Environment Variables สำหรับ Production
ตั้งค่าใน Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## การแก้ไขปัญหา

### 1. Admin Login ไม่ได้
- ตรวจสอบ `ADMIN_USERNAME` และ `ADMIN_PASSWORD` ใน `.env.local`
- ลบ localStorage และลองใหม่

### 2. หนังสือไม่แสดง
- ตรวจสอบ Supabase connection
- ดู console errors

### 3. API ไม่ทำงาน
- ตรวจสอบ Supabase configuration
- ดู network tab ใน browser dev tools

### 4. Google Drive ไม่ทำงาน
- ตรวจสอบ Google Drive Service Account credentials
- ไปที่ `/admin/test-google-drive` เพื่อทดสอบ
- ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account email แล้ว
- ดู `GOOGLE_DRIVE_SETUP.md` สำหรับการตั้งค่า

## Security Notes

⚠️ **สำคัญ**: เปลี่ยน `ADMIN_USERNAME` และ `ADMIN_PASSWORD` เป็นค่าที่ปลอดภัยก่อน deploy production!

## Support

หากมีปัญหาสามารถดู:
- Console errors ใน browser
- Network tab สำหรับ API calls
- Supabase dashboard สำหรับ database issues
