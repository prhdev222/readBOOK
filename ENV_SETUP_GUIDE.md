# 🔧 คู่มือตั้งค่า Environment Variables

## 🚨 **ปัญหาที่พบ**
```
Error: no channel access token
```

## ✅ **วิธีแก้ไข**

### **1. สร้างไฟล์ `.env.local`**

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `digital-library/` และเพิ่มข้อมูลดังนี้:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Drive API Configuration
GOOGLE_DRIVE_CLIENT_EMAIL=readbook-service@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=1ABC123DEF456GHI789JKL

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (for Gmail Login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Line Login API (จำเป็นสำหรับการทำงาน)
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token

# Line LIFF
NEXT_PUBLIC_LIFF_ID=your-liff-id
NEXT_PUBLIC_LIFF_ENDPOINT=https://liff.line.me
NEXT_PUBLIC_LINE_CHANNEL_ID=your-line-channel-id

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **2. ตั้งค่า Line API Credentials**

#### **ขั้นตอนการได้ Line API Credentials:**

1. **ไปที่ [Line Developers Console](https://developers.line.biz/)**
2. **สร้าง Provider** (ถ้ายังไม่มี)
3. **สร้าง Channel** ประเภท "LINE Login"
4. **ตั้งค่า Callback URL**: `http://localhost:3000/api/auth/callback/line`
5. **เปิดใช้งาน Channel**
6. **คัดลอกข้อมูล:**
   - **Channel ID** → `LINE_CHANNEL_ID`
   - **Channel Secret** → `LINE_CHANNEL_SECRET`
   - **Channel Access Token** → `LINE_CHANNEL_ACCESS_TOKEN`

#### **รายละเอียดเพิ่มเติม:**
- ดูคู่มือเต็มในไฟล์ `LINE_LOGIN_SETUP.md`
- ดูตัวอย่างการตั้งค่าในไฟล์ `env.local.example`

### **3. ตั้งค่าอื่นๆ (ถ้าต้องการ)**

#### **Supabase (สำหรับ Database):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### **Google Drive API (สำหรับไฟล์):**
```env
GOOGLE_DRIVE_CLIENT_EMAIL=readbook-service@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=1ABC123DEF456GHI789JKL
```

#### **Google OAuth (สำหรับ Gmail Login):**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **4. รีสตาร์ทเซิร์ฟเวอร์**

```bash
npm run dev
```

## 🔍 **การตรวจสอบ**

### **ตรวจสอบ Environment Variables:**

1. **เปิด Developer Console** ในเบราว์เซอร์
2. **ดู Console Messages:**
   - ✅ `Line configuration is complete` = ตั้งค่าถูกต้อง
   - ❌ `Line configuration is incomplete` = ต้องตั้งค่าใหม่

### **ทดสอบ Line Login:**

1. ไปที่ `http://localhost:3000`
2. คลิก "เข้าสู่ระบบด้วย Line"
3. ควร redirect ไป Line Login (ไม่ error)

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: Line configuration is incomplete**

**สาเหตุ**: Environment variables ไม่ครบ

**วิธีแก้**:
1. ตรวจสอบไฟล์ `.env.local`
2. ตรวจสอบชื่อตัวแปร (ต้องตรงกับที่ระบุ)
3. ตรวจสอบค่าที่ใส่ (ไม่ควรเป็น `your-xxx-here`)

### **Error: invalid_request**

**สาเหตุ**: Callback URL ไม่ตรง

**วิธีแก้**:
1. ตรวจสอบ `NEXTAUTH_URL` ใน `.env.local`
2. ตรวจสอบ Callback URL ใน Line Console
3. ต้องเป็น `http://localhost:3000/api/auth/callback/line`

### **Error: unauthorized_client**

**สาเหตุ**: Channel ID หรือ Secret ผิด

**วิธีแก้**:
1. คัดลอกใหม่จาก Line Console
2. ตรวจสอบการเว้นวรรคหรืออักขระพิเศษ
3. รีสตาร์ทเซิร์ฟเวอร์

## 📝 **หมายเหตุ**

- **ไฟล์ `.env.local`** จะไม่ถูก commit ไป Git (ปลอดภัย)
- **Environment Variables** ต้องตั้งค่าก่อนรันเซิร์ฟเวอร์
- **สำหรับ Production** ต้องเปลี่ยน `NEXTAUTH_URL` เป็น HTTPS
- **ดูตัวอย่าง** ในไฟล์ `env.local.example`

## 🔗 **ไฟล์ที่เกี่ยวข้อง**

- `src/lib/line-auth.ts` - Line authentication logic
- `env.local.example` - ตัวอย่าง environment variables
- `LINE_LOGIN_SETUP.md` - คู่มือตั้งค่า Line API
- `GOOGLE_OAUTH_SETUP.md` - คู่มือตั้งค่า Google OAuth
- `GOOGLE_SERVICE_ACCOUNT_GUIDE.md` - คู่มือตั้งค่า Google Drive API
