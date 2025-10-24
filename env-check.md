# 🔍 ตรวจสอบ Google Drive API Credentials

## 📋 ขั้นตอนการตรวจสอบ

### **1. ตรวจสอบไฟล์ .env.local**

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `digital-library`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Drive API Configuration
GOOGLE_DRIVE_CLIENT_EMAIL=readbook-service@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=1ABC123DEF456GHI789JKL

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **2. ตรวจสอบ JSON Key File**

เปิดไฟล์ JSON ที่ดาวน์โหลดมา (เช่น: `readbook-service-0e504e36b949.json`):

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "readbook-service@your-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901"
}
```

### **3. คัดลอกข้อมูลจาก JSON**

#### **CLIENT_EMAIL:**
```bash
GOOGLE_DRIVE_CLIENT_EMAIL=readbook-service@your-project.iam.gserviceaccount.com
```

#### **PRIVATE_KEY:**
```bash
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### **4. ดึง Folder ID**

1. เปิด Google Drive
2. เปิดโฟลเดอร์ที่สร้างไว้
3. คัดลอก URL จากแถบที่อยู่
4. URL จะมีรูปแบบ: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789JKL`
5. **Folder ID** คือ: `1ABC123DEF456GHI789JKL`

### **5. ตรวจสอบการแชร์โฟลเดอร์**

1. เปิด Google Drive
2. คลิกขวาที่โฟลเดอร์ → **"Share"**
3. เพิ่ม **Email ของ Service Account**:
   - ใส่: `readbook-service@your-project.iam.gserviceaccount.com`
   - ตั้งสิทธิ์: **"Editor"**
   - คลิก **"Send"**

## ⚠️ ข้อควรระวัง

### **❌ ปัญหาที่พบบ่อย:**

1. **Private Key ไม่ถูกต้อง:**
   - ตรวจสอบเครื่องหมายคำพูด
   - ตรวจสอบ `\n` สำหรับขึ้นบรรทัดใหม่
   - ตรวจสอบ `-----BEGIN PRIVATE KEY-----` และ `-----END PRIVATE KEY-----`

2. **Folder ID ไม่ถูกต้อง:**
   - ตรวจสอบ URL ของโฟลเดอร์
   - ตรวจสอบว่าแชร์กับ Service Account แล้ว

3. **Service Account ไม่มีสิทธิ์:**
   - ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account
   - ตรวจสอบสิทธิ์เป็น "Editor"

## 🧪 ทดสอบการเชื่อมต่อ

### **1. รีสตาร์ทเซิร์ฟเวอร์**
```bash
# หยุดเซิร์ฟเวอร์ (Ctrl+C)
# เริ่มใหม่
npm run dev
```

### **2. ไปที่หน้าทดสอบ**
- URL: `http://localhost:3000/admin/test-connection`
- คลิก **"ทดสอบ Google Drive"**

### **3. ตรวจสอบผลลัพธ์**
- ✅ **สำเร็จ:** จะแสดง "เชื่อมต่อสำเร็จ"
- ❌ **ล้มเหลว:** จะแสดงข้อความข้อผิดพลาด

## 🔧 การแก้ไขปัญหา

### **ปัญหา: "Missing environment variables"**
**วิธีแก้:**
1. ตรวจสอบไฟล์ `.env.local` มีอยู่
2. ตรวจสอบชื่อตัวแปรถูกต้อง
3. ตรวจสอบเครื่องหมายคำพูด

### **ปัญหา: "Invalid credentials"**
**วิธีแก้:**
1. ตรวจสอบ CLIENT_EMAIL ถูกต้อง
2. ตรวจสอบ PRIVATE_KEY ถูกต้อง
3. ตรวจสอบ JSON key file

### **ปัญหา: "Folder not found"**
**วิธีแก้:**
1. ตรวจสอบ FOLDER_ID ถูกต้อง
2. ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account
3. ตรวจสอบสิทธิ์เป็น "Editor"

## 📞 การสนับสนุน

หากยังมีปัญหา:
1. ตรวจสอบ Console ในเบราว์เซอร์ (F12)
2. ดู Terminal output
3. ตรวจสอบ Google Cloud Console
4. ตรวจสอบ Google Drive sharing settings
