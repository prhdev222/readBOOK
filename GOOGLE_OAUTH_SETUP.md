# 🔐 คู่มือตั้งค่า Google OAuth สำหรับ Gmail Login

## 📋 **ขั้นตอนการตั้งค่า Google OAuth**

### **1. สร้าง Google Cloud Project**

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. คลิก **"Select a project"** หรือ **"New Project"**
3. ตั้งชื่อโปรเจค เช่น `readbook-oauth`
4. คลิก **"Create"**

### **2. เปิดใช้งาน Google+ API**

1. ไปที่ **"APIs & Services"** > **"Library"**
2. ค้นหา **"Google+ API"** หรือ **"Google Identity"**
3. คลิก **"Enable"**

### **3. สร้าง OAuth 2.0 Credentials**

1. ไปที่ **"APIs & Services"** > **"Credentials"**
2. คลิก **"+ CREATE CREDENTIALS"**
3. เลือก **"OAuth client ID"**

### **4. ตั้งค่า OAuth Consent Screen**

1. ไปที่ **"OAuth consent screen"**
2. เลือก **"External"** (สำหรับผู้ใช้ทั่วไป)
3. กรอกข้อมูล:
   - **App name**: `readBOOK`
   - **User support email**: อีเมลของคุณ
   - **Developer contact information**: อีเมลของคุณ
4. คลิก **"Save and Continue"**

### **5. ตั้งค่า Scopes**

1. ในหน้า **"Scopes"**
2. คลิก **"Add or Remove Scopes"**
3. เลือก:
   - `userinfo.email`
   - `userinfo.profile`
4. คลิก **"Update"** > **"Save and Continue"**

### **6. ตั้งค่า Test Users (สำหรับ Development)**

1. ในหน้า **"Test users"**
2. คลิก **"+ ADD USERS"**
3. เพิ่มอีเมลที่ต้องการทดสอบ
4. คลิก **"Save and Continue"**

### **7. สร้าง OAuth Client ID**

1. กลับไปที่ **"Credentials"**
2. คลิก **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. เลือก **"Web application"**
4. ตั้งชื่อ: `readBOOK Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```
7. คลิก **"Create"**

### **8. คัดลอก Client ID และ Client Secret**

1. หลังจากสร้างเสร็จ จะได้:
   - **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-abcdefghijklmnop`

### **9. ตั้งค่า Environment Variables**

เพิ่มในไฟล์ `.env.local`:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

### **10. สร้าง NEXTAUTH_SECRET**

```bash
# ใช้ OpenSSL
openssl rand -base64 32

# หรือใช้ Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🔧 **การทดสอบ**

### **1. เริ่มเซิร์ฟเวอร์**

```bash
npm run dev
```

### **2. ทดสอบการเข้าสู่ระบบ**

1. ไปที่ `http://localhost:3000`
2. คลิก **"เข้าสู่ระบบ"**
3. เลือก **"เข้าสู่ระบบด้วย Google"**
4. ใส่บัญชี Google ที่เพิ่มใน Test Users
5. อนุญาตการเข้าถึง

### **3. ตรวจสอบผลลัพธ์**

- ควรเห็นชื่อผู้ใช้ในหน้าแรก
- มีปุ่ม "ออกจากระบบ"
- สามารถเข้าถึงหน้าผู้ใช้ได้

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: redirect_uri_mismatch**

**สาเหตุ**: Redirect URI ไม่ตรงกับที่ตั้งค่าใน Google Console

**วิธีแก้**:
1. ตรวจสอบ URI ใน Google Console
2. ต้องมี `http://localhost:3000/api/auth/callback/google`
3. ตรวจสอบ `NEXTAUTH_URL` ใน `.env.local`

### **Error: invalid_client**

**สาเหตุ**: Client ID หรือ Client Secret ผิด

**วิธีแก้**:
1. ตรวจสอบ `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET`
2. คัดลอกใหม่จาก Google Console
3. รีสตาร์ทเซิร์ฟเวอร์

### **Error: access_denied**

**สาเหตุ**: OAuth Consent Screen ยังไม่ผ่านการตรวจสอบ

**วิธีแก้**:
1. ตรวจสอบ Test Users
2. ตั้งค่า OAuth Consent Screen ให้ถูกต้อง
3. รอการอนุมัติจาก Google (อาจใช้เวลาหลายวัน)

## 📚 **ข้อมูลเพิ่มเติม**

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## ✅ **Checklist**

- [ ] สร้าง Google Cloud Project
- [ ] เปิดใช้งาน Google+ API
- [ ] ตั้งค่า OAuth Consent Screen
- [ ] สร้าง OAuth Client ID
- [ ] ตั้งค่า Environment Variables
- [ ] ทดสอบการเข้าสู่ระบบ
- [ ] ตรวจสอบการทำงาน

---

**หมายเหตุ**: สำหรับ Production ต้องเปลี่ยน `NEXTAUTH_URL` และ `Authorized redirect URIs` เป็น domain จริง
