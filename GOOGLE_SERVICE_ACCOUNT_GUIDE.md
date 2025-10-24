# 🔐 คู่มือการสร้าง Google Service Account

## 📋 ขั้นตอนการสร้าง Service Account

### **ขั้นตอนที่ 1: เข้าสู่ Google Cloud Console**

1. เปิดเบราว์เซอร์และไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. เข้าสู่ระบบด้วยบัญชี Google ของคุณ
3. หากยังไม่มีโปรเจค ให้สร้างโปรเจคใหม่:
   - คลิก **"Select a project"** ด้านบน
   - คลิก **"New Project"**
   - ตั้งชื่อโปรเจค: `readbook-project`
   - คลิก **"Create"**

### **ขั้นตอนที่ 2: เปิดใช้งาน Google Drive API**

1. ในเมนูซ้าย คลิก **"APIs & Services"** → **"Library"**
2. ค้นหา **"Google Drive API"**
3. คลิก **"Google Drive API"**
4. คลิก **"Enable"** เพื่อเปิดใช้งาน

### **ขั้นตอนที่ 3: สร้าง Service Account**

1. ไปที่ **"IAM & Admin"** → **"Service Accounts"**
2. คลิก **"+ CREATE SERVICE ACCOUNT"**
3. กรอกข้อมูล:
   - **Service account name:** `readbook-service`
   - **Service account ID:** จะสร้างอัตโนมัติ (เช่น: `readbook-service@your-project.iam.gserviceaccount.com`)
   - **Description:** `Service account for readBOOK application`
4. คลิก **"CREATE AND CONTINUE"**

### **ขั้นตอนที่ 4: กำหนดสิทธิ์ (Role)**

1. ในหน้า **"Grant this service account access to project"**:
   - เลือก **"Editor"** หรือ **"Storage Admin"**
   - คลิก **"CONTINUE"**
2. ในหน้า **"Grant users access to this service account"**:
   - ข้ามขั้นตอนนี้ (ไม่ต้องเพิ่มผู้ใช้)
   - คลิก **"DONE"**

### **ขั้นตอนที่ 5: สร้างและดาวน์โหลด JSON Key**

1. ในหน้า **"Service Accounts"** คุณจะเห็น Service Account ที่สร้างแล้ว
2. คลิกที่ **Email** ของ Service Account (เช่น: `readbook-service@your-project.iam.gserviceaccount.com`)
3. ไปที่แท็บ **"KEYS"**
4. คลิก **"ADD KEY"** → **"Create new key"**
5. เลือก **"JSON"** และคลิก **"CREATE"**
6. ไฟล์ JSON จะดาวน์โหลดอัตโนมัติ (ชื่อไฟล์: `your-project-xxxxx.json`)

### **ขั้นตอนที่ 6: ตั้งค่า Google Drive Folder**

1. เปิด [Google Drive](https://drive.google.com)
2. สร้างโฟลเดอร์ใหม่:
   - คลิก **"+ New"** → **"Folder"**
   - ตั้งชื่อ: `readBOOK Database`
3. คลิกขวาที่โฟลเดอร์ → **"Share"**
4. เพิ่ม **Email ของ Service Account** (จากขั้นตอนที่ 4):
   - ใส่: `readbook-service@your-project.iam.gserviceaccount.com`
   - ตั้งสิทธิ์: **"Editor"**
   - คลิก **"Send"**

### **ขั้นตอนที่ 7: ดึง Folder ID**

1. เปิดโฟลเดอร์ `readBOOK Database` ใน Google Drive
2. คัดลอก URL จากแถบที่อยู่
3. URL จะมีรูปแบบ: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789JKL`
4. **Folder ID** คือ: `1ABC123DEF456GHI789JKL` (ส่วนหลัง `/folders/`)

## 🔧 การตั้งค่า Environment Variables

### **เปิดไฟล์ JSON ที่ดาวน์โหลดมา**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "readbook-service@your-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/readbook-service%40your-project.iam.gserviceaccount.com"
}
```

### **สร้างไฟล์ .env.local**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Drive API Configuration
GOOGLE_DRIVE_API_KEY=your_api_key_here
GOOGLE_DRIVE_CLIENT_EMAIL=readbook-service@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=1ABC123DEF456GHI789JKL

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🧪 ทดสอบการเชื่อมต่อ

### **1. รีสตาร์ทเซิร์ฟเวอร์**
```bash
# หยุดเซิร์ฟเวอร์ (Ctrl+C)
# เริ่มใหม่
cd "C:\Users\urare\OneDrive\Desktop\readBOOK\digital-library"
npm run dev
```

### **2. ไปที่หน้าทดสอบ**
- URL: `http://localhost:3000/admin/test-connection`
- คลิก **"ทดสอบ Google Drive"**
- ดูผลลัพธ์

## ⚠️ ข้อควรระวัง

### **ความปลอดภัย:**
- ❌ **อย่าแชร์ไฟล์ JSON** ให้ใคร
- ❌ **อย่า commit ไฟล์ JSON** ลง Git
- ✅ **เก็บไฟล์ JSON ไว้ในเครื่องเท่านั้น**
- ✅ **ใช้ .env.local** สำหรับเก็บ credentials

### **การแก้ไขปัญหา:**

#### **ปัญหา: "The caller does not have permission"**
**วิธีแก้:**
1. ตรวจสอบว่า Service Account มีสิทธิ์ **Editor** หรือ **Storage Admin**
2. ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account แล้ว

#### **ปัญหา: "Folder not found"**
**วิธีแก้:**
1. ตรวจสอบ Folder ID ถูกต้อง
2. ตรวจสอบว่าโฟลเดอร์แชร์กับ Service Account แล้ว

#### **ปัญหา: "Invalid credentials"**
**วิธีแก้:**
1. ตรวจสอบ JSON key ถูกต้อง
2. ตรวจสอบ client_email และ private_key ใน .env.local

## 📞 การสนับสนุน

หากมีปัญหา:
1. ตรวจสอบ Console ในเบราว์เซอร์ (F12)
2. ดู Terminal output
3. ตรวจสอบ Google Cloud Console
4. ตรวจสอบ Google Drive sharing settings

## 🔗 ลิงก์สำคัญ

- **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com)
- **Google Drive:** [drive.google.com](https://drive.google.com)
- **Google Drive API Docs:** [developers.google.com/drive/api](https://developers.google.com/drive/api)
