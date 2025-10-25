# 🚀 Google Drive Service Account - Quick Setup Guide

## ⚠️ ปัญหาที่พบ
```
ข้อผิดพลาด: error:1E08010C:DECODER routines::unsupported
Service Account Email: ❌ ไม่ได้ตั้งค่า
Private Key: ❌ ไม่ได้ตั้งค่า
Folder ID: ❌ ไม่ได้ตั้งค่า
```

## 🔧 วิธีแก้ไข

### **ขั้นตอนที่ 1: สร้างไฟล์ .env.local**

1. คัดลอกไฟล์ `env.local.setup` เป็น `.env.local`:
```bash
copy env.local.setup .env.local
```

### **ขั้นตอนที่ 2: ตั้งค่า Google Service Account**

#### **2.1 ไปที่ Google Cloud Console**
- เปิด [Google Cloud Console](https://console.cloud.google.com)
- สร้างโปรเจคใหม่หรือเลือกโปรเจคที่มีอยู่

#### **2.2 เปิดใช้งาน Google Drive API**
- ไปที่ **APIs & Services** → **Library**
- ค้นหา **"Google Drive API"**
- คลิก **Enable**

#### **2.3 สร้าง Service Account**
- ไปที่ **IAM & Admin** → **Service Accounts**
- คลิก **"+ CREATE SERVICE ACCOUNT"**
- ตั้งชื่อ: `readbook-service`
- เลือก Role: **Editor** หรือ **Storage Admin**
- คลิก **DONE**

#### **2.4 สร้าง JSON Key**
- คลิกที่ Service Account ที่สร้าง
- ไปที่แท็บ **KEYS**
- คลิก **ADD KEY** → **Create new key**
- เลือก **JSON** และคลิก **CREATE**
- ไฟล์ JSON จะดาวน์โหลดอัตโนมัติ

#### **2.5 ตั้งค่า Google Drive Folder**
- เปิด [Google Drive](https://drive.google.com)
- สร้างโฟลเดอร์ใหม่: `readBOOK Database`
- คลิกขวาที่โฟลเดอร์ → **Share**
- เพิ่ม **Email ของ Service Account** (จาก JSON file)
- ตั้งสิทธิ์: **Editor**

#### **2.6 ดึง Folder ID**
- เปิดโฟลเดอร์ใน Google Drive
- คัดลอก URL: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789JKL`
- **Folder ID** คือ: `1ABC123DEF456GHI789JKL`

### **ขั้นตอนที่ 3: ใส่ข้อมูลใน .env.local**

เปิดไฟล์ `.env.local` และใส่ข้อมูลจาก JSON file:

```bash
# ใส่ข้อมูลจาก JSON file ที่ดาวน์โหลด
GOOGLE_DRIVE_CLIENT_EMAIL=readbook-service@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=1ABC123DEF456GHI789JKL
```

### **ขั้นตอนที่ 4: ทดสอบการตั้งค่า**

1. **รีสตาร์ทเซิร์ฟเวอร์:**
```bash
# หยุดเซิร์ฟเวอร์ (Ctrl+C)
# เริ่มใหม่
npm run dev
```

2. **ไปที่หน้าทดสอบ:**
- URL: `http://localhost:3000/admin/test-google-drive`
- คลิก **"ทดสอบการเชื่อมต่อ"**

## 🔍 การแก้ไขปัญหา

### **ปัญหา: "error:1E08010C:DECODER routines::unsupported"**
**สาเหตุ:** Private Key ไม่ถูกต้องหรือไม่มีการตั้งค่า

**วิธีแก้:**
1. ตรวจสอบว่า Private Key อยู่ในรูปแบบที่ถูกต้อง:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

2. ตรวจสอบว่าใช้ `\n` แทน newline จริงใน .env.local

3. ตรวจสอบว่าไม่มีช่องว่างหรืออักขระพิเศษ

### **ปัญหา: "The caller does not have permission"**
**วิธีแก้:**
1. ตรวจสอบว่า Service Account มีสิทธิ์ **Editor** หรือ **Storage Admin**
2. ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account แล้ว

### **ปัญหา: "Folder not found"**
**วิธีแก้:**
1. ตรวจสอบ Folder ID ถูกต้อง
2. ตรวจสอบว่าโฟลเดอร์แชร์กับ Service Account แล้ว

## 📋 Checklist การตั้งค่า

- [ ] สร้างไฟล์ `.env.local`
- [ ] เปิดใช้งาน Google Drive API
- [ ] สร้าง Service Account
- [ ] ดาวน์โหลด JSON key
- [ ] แชร์โฟลเดอร์กับ Service Account
- [ ] ใส่ข้อมูลใน .env.local
- [ ] รีสตาร์ทเซิร์ฟเวอร์
- [ ] ทดสอบการเชื่อมต่อ

## 🆘 หากยังมีปัญหา

1. ตรวจสอบ Console ในเบราว์เซอร์ (F12)
2. ดู Terminal output
3. ตรวจสอบ Google Cloud Console
4. ตรวจสอบ Google Drive sharing settings
5. ตรวจสอบไฟล์ .env.local ว่ามีข้อมูลครบถ้วน
