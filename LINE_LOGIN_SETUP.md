# 📱 คู่มือตั้งค่า Line Login API

## 📋 **ขั้นตอนการตั้งค่า Line Login**

### **1. สร้าง Line Developers Account**

1. ไปที่ [Line Developers Console](https://developers.line.biz/)
2. คลิก **"Log in"** และเข้าสู่ระบบด้วยบัญชี Line
3. คลิก **"Create"** เพื่อสร้างโปรเจคใหม่

### **2. สร้าง Provider**

1. ไปที่ **"Providers"** tab
2. คลิก **"Create"**
3. ตั้งชื่อ Provider: `readBOOK`
4. ตั้งชื่อ Company: ชื่อบริษัทของคุณ
5. คลิก **"Create"**

### **3. สร้าง Channel**

1. ไปที่ **"Channels"** tab
2. คลิก **"Create a new channel"**
3. เลือก **"LINE Login"**
4. กรอกข้อมูล:
   - **Channel name**: `readBOOK Login`
   - **Channel description**: `Login system for readBOOK`
   - **App types**: เลือก **"Web app"**
   - **Email address**: อีเมลของคุณ
5. คลิก **"Create"**

### **4. ตั้งค่า Channel**

1. ไปที่ Channel ที่สร้างใหม่
2. คลิก **"LINE Login"** tab
3. ตั้งค่า **"App settings"**:
   - **App name**: `readBOOK`
   - **App description**: `Digital library platform`
   - **App icon**: อัปโหลดไอคอน (512x512px)
   - **Privacy policy URL**: `https://your-domain.com/privacy`
   - **Terms of use URL**: `https://your-domain.com/terms`

### **5. ตั้งค่า Callback URL**

1. ในหน้า **"LINE Login"** tab
2. ไปที่ **"Callback URL"** section
3. เพิ่ม URL:
   ```
   http://localhost:3000/api/auth/callback/line
   https://your-domain.com/api/auth/callback/line
   ```
4. คลิก **"Save"**

### **6. ตั้งค่า Scopes**

1. ในหน้า **"LINE Login"** tab
2. ไปที่ **"OpenID Connect"** section
3. เปิดใช้งาน:
   - ✅ **openid**
   - ✅ **profile**
   - ✅ **email**
4. คลิก **"Save"**

### **7. เปิดใช้งาน Channel**

1. ไปที่ **"Basic settings"** tab
2. คลิก **"Issue"** เพื่อเปิดใช้งาน Channel
3. ตั้งค่า **"Channel status"** เป็น **"Published"**

### **8. คัดลอก Credentials**

1. ไปที่ **"Basic settings"** tab
2. คัดลอกข้อมูล:
   - **Channel ID**: `1234567890`
   - **Channel secret**: `abcdef1234567890`
3. ไปที่ **"Messaging API"** tab (ถ้ามี)
4. คัดลอก **Channel access token**: `Bearer xxxxxx`

### **9. ตั้งค่า Environment Variables**

เพิ่มในไฟล์ `.env.local`:

```env
# Line Login API
LINE_CHANNEL_ID=1234567890
LINE_CHANNEL_SECRET=abcdef1234567890
LINE_CHANNEL_ACCESS_TOKEN=Bearer xxxxxx
```

## 🔧 **การทดสอบ**

### **1. เริ่มเซิร์ฟเวอร์**

```bash
npm run dev
```

### **2. ทดสอบการเข้าสู่ระบบ**

1. ไปที่ `http://localhost:3000`
2. คลิก **"เข้าสู่ระบบด้วย Line"**
3. ระบบจะ redirect ไป Line Login
4. อนุญาตการเข้าถึง
5. ระบบจะ redirect กลับมาพร้อมข้อมูลผู้ใช้

### **3. ตรวจสอบผลลัพธ์**

- ควรเห็นชื่อผู้ใช้ในหน้าแรก
- มีปุ่ม "ออกจากระบบ"
- สามารถเข้าถึงหน้าผู้ใช้ได้

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: invalid_request**

**สาเหตุ**: Callback URL ไม่ตรงกับที่ตั้งค่าใน Line Console

**วิธีแก้**:
1. ตรวจสอบ Callback URL ใน Line Console
2. ต้องมี `http://localhost:3000/api/auth/callback/line`
3. ตรวจสอบ `NEXTAUTH_URL` ใน `.env.local`

### **Error: unauthorized_client**

**สาเหตุ**: Channel ID หรือ Channel Secret ผิด

**วิธีแก้**:
1. ตรวจสอบ `LINE_CHANNEL_ID` และ `LINE_CHANNEL_SECRET`
2. คัดลอกใหม่จาก Line Console
3. รีสตาร์ทเซิร์ฟเวอร์

### **Error: access_denied**

**สาเหตุ**: ผู้ใช้ปฏิเสธการอนุญาต

**วิธีแก้**:
1. ตรวจสอบ Scopes ที่ตั้งค่า
2. ตรวจสอบ App settings
3. ลองใหม่อีกครั้ง

### **Error: invalid_scope**

**สาเหตุ**: Scopes ที่ขอไม่ถูกต้อง

**วิธีแก้**:
1. ตรวจสอบ Scopes ใน Line Console
2. ต้องมี `openid`, `profile`, `email`
3. ตรวจสอบการตั้งค่า OpenID Connect

## 📚 **ข้อมูลเพิ่มเติม**

- [Line Login Documentation](https://developers.line.biz/en/docs/line-login/)
- [Line Developers Console](https://developers.line.biz/)
- [Line Login API Reference](https://developers.line.biz/en/reference/line-login-api/)

## ✅ **Checklist**

- [ ] สร้าง Line Developers Account
- [ ] สร้าง Provider
- [ ] สร้าง Channel
- [ ] ตั้งค่า App settings
- [ ] ตั้งค่า Callback URL
- [ ] ตั้งค่า Scopes
- [ ] เปิดใช้งาน Channel
- [ ] ตั้งค่า Environment Variables
- [ ] ทดสอบการเข้าสู่ระบบ
- [ ] ตรวจสอบการทำงาน

## 🔐 **Security Notes**

1. **Channel Secret**: เก็บเป็นความลับ ไม่เปิดเผยในโค้ด
2. **Access Token**: ใช้เฉพาะใน server-side
3. **Callback URL**: ใช้ HTTPS ใน production
4. **Scopes**: ขอเฉพาะที่จำเป็น

---

**หมายเหตุ**: สำหรับ Production ต้องเปลี่ยน Callback URL และใช้ HTTPS
