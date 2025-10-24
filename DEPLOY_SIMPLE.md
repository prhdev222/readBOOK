# 🚀 Deploy Digital Library ไป Vercel (แบบง่าย)

## 📋 **ขั้นตอนการ Deploy**

### **1. เตรียม GitHub Repository**

```bash
# สร้าง Git repository
git init
git add .
git commit -m "Initial commit: Digital Library"

# สร้าง GitHub repository
# ไปที่ https://github.com/new
# สร้าง repository ชื่อ "digital-library"
# แล้วเชื่อมต่อ:

git remote add origin https://github.com/yourusername/digital-library.git
git push -u origin main
```

### **2. Deploy ผ่าน Vercel**

1. **ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)**
2. **คลิก "New Project"**
3. **เลือก GitHub repository "digital-library"**
4. **ตั้งค่า:**
   - Project Name: `digital-library`
   - Framework: `Next.js`
   - Root Directory: `./`
5. **คลิก "Deploy"**

### **3. ตั้งค่า Environment Variables**

ใน Vercel Dashboard > Project Settings > Environment Variables:

#### **ตัวแปรพื้นฐาน (จำเป็น)**
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

#### **ตัวแปร Google Drive API (จำเป็น)**
```
GOOGLE_DRIVE_CLIENT_EMAIL=your_service_account_email
GOOGLE_DRIVE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_DRIVE_DB_FOLDER_ID=your_database_folder_id
```

### **4. สร้าง NEXTAUTH_SECRET**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### **5. รีสตาร์ท Deployment**

1. ไปที่ Deployments tab
2. คลิก "Redeploy" บน deployment ล่าสุด

## 🔐 **การตั้งค่า Google Drive API**

### **1. สร้าง Google Cloud Project**

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจคใหม่
3. เปิดใช้งาน Google Drive API

### **2. สร้าง Service Account**

1. ไปที่ IAM & Admin > Service Accounts
2. สร้าง Service Account
3. ดาวน์โหลด JSON key

### **3. ตั้งค่า Google Drive Folder**

1. สร้างโฟลเดอร์ใน Google Drive
2. แชร์ให้ Service Account
3. คัดลอก Folder ID

## 🧪 **การทดสอบ**

### **1. ทดสอบหน้าแรก**
```
https://your-project.vercel.app
```

### **2. ทดสอบ Admin Login**
```
https://your-project.vercel.app/admin/login
```

## 🔄 **การเพิ่ม Google OAuth และ Line Login ทีหลัง**

### **1. เพิ่ม Google OAuth**

1. ไปที่ Google Cloud Console
2. สร้าง OAuth 2.0 Client ID
3. เพิ่ม Environment Variables:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### **2. เพิ่ม Line Login**

1. ไปที่ Line Developers Console
2. สร้าง LINE Login Channel
3. เพิ่ม Environment Variables:
   ```
   LINE_CHANNEL_ID=your_line_channel_id
   LINE_CHANNEL_SECRET=your_line_channel_secret
   LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   ```

## ✅ **ผลลัพธ์**

หลังจากเสร็จสิ้น คุณจะได้:
- ✅ Digital Library บน Vercel
- ✅ Admin Panel สำหรับจัดการหนังสือ
- ✅ Google Drive integration
- ✅ พร้อมเพิ่ม Google OAuth และ Line Login ทีหลัง

**URL**: `https://your-project.vercel.app`
**Admin**: `https://your-project.vercel.app/admin`
