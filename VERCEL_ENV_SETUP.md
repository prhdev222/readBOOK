# 🔧 Environment Variables สำหรับ Vercel

## 📋 **ตัวแปรที่จำเป็น (Required)**

### **1. Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### **2. Google Drive API Configuration**
```
GOOGLE_DRIVE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=your_google_drive_folder_id_here
```

### **3. NextAuth.js Configuration**
```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

### **4. Admin Credentials**
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### **5. Application Configuration**
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NODE_ENV=production
```

## 🔐 **ตัวแปรเสริม (Optional)**

### **Google OAuth (สำหรับ Gmail Login)**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **Line Login API**
```
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
```

### **Line LIFF**
```
NEXT_PUBLIC_LIFF_ID=your_liff_id
NEXT_PUBLIC_LIFF_ENDPOINT=https://liff.line.me
NEXT_PUBLIC_LINE_CHANNEL_ID=your_line_channel_id
```

## 🚀 **วิธีตั้งค่าใน Vercel**

1. ไปที่ **Vercel Dashboard** > **Project Settings** > **Environment Variables**
2. เพิ่มตัวแปรข้างต้นทีละตัว
3. คลิก **Save** หลังจากเพิ่มแต่ละตัวแปร
4. ไปที่ **Deployments** tab และคลิก **Redeploy**

## 🔑 **วิธีสร้าง NEXTAUTH_SECRET**

รันคำสั่งนี้ใน terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ✅ **การตรวจสอบ**

หลังจากตั้งค่าแล้ว:
- ✅ หน้าแรก: `https://your-project.vercel.app`
- ✅ Admin Login: `https://your-project.vercel.app/admin/login`
- ✅ ระบบจัดการหนังสือทำงานได้
- ✅ Google Drive integration ทำงานได้
