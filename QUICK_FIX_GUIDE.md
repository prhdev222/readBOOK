# 🚨 แก้ไขปัญหา "no channel access token" อย่างรวดเร็ว

## ❌ **ปัญหาที่พบ**
```
Error: no channel access token
at module evaluation (src/lib/line-auth.ts:7:3)
```

## ✅ **วิธีแก้ไข (3 ขั้นตอน)**

### **ขั้นตอนที่ 1: สร้างไฟล์ `.env.local`**

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `digital-library/` ด้วยเนื้อหาดังนี้:

```env
# Line Login API (จำเป็นสำหรับการทำงาน)
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **ขั้นตอนที่ 2: ตั้งค่า Line API Credentials**

1. **ไปที่ [Line Developers Console](https://developers.line.biz/)**
2. **สร้าง Channel** ประเภท "LINE Login"
3. **ตั้งค่า Callback URL**: `http://localhost:3000/api/auth/callback/line`
4. **คัดลอกข้อมูล:**
   - **Channel ID** → แทนที่ `your-line-channel-id`
   - **Channel Secret** → แทนที่ `your-line-channel-secret`
   - **Channel Access Token** → แทนที่ `your-line-channel-access-token`

### **ขั้นตอนที่ 3: รีสตาร์ทเซิร์ฟเวอร์**

```bash
npm run dev
```

## 🔍 **การตรวจสอบ**

### **ตรวจสอบใน Console:**
- ✅ `Line configuration is complete` = ตั้งค่าถูกต้อง
- ❌ `Line configuration is incomplete` = ต้องตั้งค่าใหม่

### **ทดสอบ:**
1. ไปที่ `http://localhost:3000`
2. ไม่ควรมี error "no channel access token"
3. ควรมี warning message แทน (ถ้ายังไม่ได้ตั้งค่า)

## 🚨 **หากยังมีปัญหา**

### **ตรวจสอบไฟล์ `.env.local`:**
1. ไฟล์ต้องอยู่ในโฟลเดอร์ `digital-library/`
2. ชื่อตัวแปรต้องตรงกับที่ระบุ
3. ไม่ควรมีช่องว่างหรืออักขระพิเศษ

### **ตรวจสอบ Line Console:**
1. Channel ต้องเปิดใช้งานแล้ว
2. Callback URL ต้องถูกต้อง
3. Scopes ต้องมี `openid`, `profile`, `email`

## 📚 **ข้อมูลเพิ่มเติม**

- **คู่มือเต็ม**: `ENV_SETUP_GUIDE.md`
- **การตั้งค่า Line**: `LINE_LOGIN_SETUP.md`
- **ตัวอย่างไฟล์**: `env.local.example`

---

**หมายเหตุ**: ไฟล์ `.env.local` จะไม่ถูก commit ไป Git (ปลอดภัย)
