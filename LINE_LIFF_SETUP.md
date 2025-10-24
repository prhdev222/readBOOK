# 📱 คู่มือตั้งค่า Line LIFF (Line Front-end Framework)

## 📋 **ขั้นตอนการตั้งค่า Line LIFF**

### **1. สร้าง LIFF App**

1. ไปที่ [Line Developers Console](https://developers.line.biz/)
2. เลือก Channel ที่สร้างไว้สำหรับ Line Login
3. ไปที่ **"LIFF"** tab
4. คลิก **"Add"** เพื่อสร้าง LIFF App

### **2. ตั้งค่า LIFF App**

1. กรอกข้อมูล LIFF App:
   - **LIFF app name**: `readBOOK`
   - **Size**: เลือก **"Full"** (สำหรับแสดงผลเต็มหน้าจอ)
   - **Endpoint URL**: 
     ```
     http://localhost:3000/liff
     https://your-domain.com/liff
     ```
2. คลิก **"Add"**

### **3. ตั้งค่า LIFF Features**

1. ในหน้า LIFF App settings
2. เปิดใช้งานฟีเจอร์:
   - ✅ **Use ID Token**
   - ✅ **Use Access Token**
   - ✅ **Use Profile**
   - ✅ **Use Share Target Picker**
3. คลิก **"Save"**

### **4. ตั้งค่า Scopes**

1. ไปที่ **"Scopes"** section
2. เลือก scopes ที่ต้องการ:
   - ✅ **openid**
   - ✅ **profile**
   - ✅ **email**
3. คลิก **"Save"**

### **5. คัดลอก LIFF ID**

1. หลังจากสร้าง LIFF App เสร็จ
2. คัดลอก **LIFF ID**: `1234567890-abcdefgh`
3. บันทึกไว้สำหรับตั้งค่า environment variables

### **6. ตั้งค่า Environment Variables**

เพิ่มในไฟล์ `.env.local`:

```env
# Line LIFF
NEXT_PUBLIC_LIFF_ID=1234567890-abcdefgh
NEXT_PUBLIC_LIFF_ENDPOINT=https://liff.line.me
```

### **7. ทดสอบ LIFF App**

#### **7.1 ทดสอบใน Browser**

1. เริ่มเซิร์ฟเวอร์:
   ```bash
   npm run dev
   ```

2. ไปที่ `http://localhost:3000/liff`
3. ควรเห็นหน้า LIFF พร้อมข้อความ "LIFF ไม่พร้อมใช้งาน"

#### **7.2 ทดสอบใน Line App**

1. เปิด Line App บนมือถือ
2. สแกน QR Code หรือเปิดลิงก์ LIFF
3. ควรเห็นหน้า readBOOK พร้อมข้อมูลผู้ใช้

## 🔧 **การใช้งาน LIFF**

### **1. ตรวจสอบการทำงานของ LIFF**

```typescript
import { initializeLiff, isInLineApp, getLiffProfile } from '@/lib/liff';

// เริ่มต้น LIFF
const success = await initializeLiff();

// ตรวจสอบว่าอยู่ใน Line App หรือไม่
const inLine = isInLineApp();

// ดึงข้อมูลผู้ใช้
const profile = await getLiffProfile();
```

### **2. แชร์เนื้อหาไปยัง Line**

```typescript
import { shareToLine } from '@/lib/liff';

// แชร์ข้อความ
await shareToLine('📚 หนังสือแนะนำ: การเขียนโปรแกรม Python');

// แชร์ข้อความพร้อมลิงก์
await shareToLine(
  '📚 หนังสือแนะนำ: การเขียนโปรแกรม Python',
  'https://your-domain.com/books/1'
);
```

### **3. เปิด Browser ภายนอก**

```typescript
import { openExternalBrowser } from '@/lib/liff';

// เปิดลิงก์ใน browser ภายนอก
openExternalBrowser('https://your-domain.com/books/1');
```

### **4. ปิด LIFF App**

```typescript
import { closeLiffApp } from '@/lib/liff';

// ปิด LIFF App
closeLiffApp();
```

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: LIFF initialization failed**

**สาเหตุ**: LIFF ID ผิดหรือ LIFF App ยังไม่เปิดใช้งาน

**วิธีแก้**:
1. ตรวจสอบ `NEXT_PUBLIC_LIFF_ID`
2. ตรวจสอบ LIFF App ใน Line Console
3. ตรวจสอบ Endpoint URL

### **Error: User not logged in**

**สาเหตุ**: ผู้ใช้ยังไม่ได้ล็อกอินใน Line

**วิธีแก้**:
1. ตรวจสอบการตั้งค่า Scopes
2. ตรวจสอบการตั้งค่า LIFF Features
3. ลองใหม่อีกครั้ง

### **Error: Share to LINE failed**

**สาเหตุ**: ไม่สามารถแชร์ได้

**วิธีแก้**:
1. ตรวจสอบการตั้งค่า Share Target Picker
2. ตรวจสอบการตั้งค่า Scopes
3. ตรวจสอบการทำงานของ LIFF

## 📚 **ข้อมูลเพิ่มเติม**

- [Line LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Line LIFF API Reference](https://developers.line.biz/en/reference/liff/)
- [Line Developers Console](https://developers.line.biz/)

## ✅ **Checklist**

- [ ] สร้าง LIFF App
- [ ] ตั้งค่า LIFF App
- [ ] ตั้งค่า LIFF Features
- [ ] ตั้งค่า Scopes
- [ ] ตั้งค่า Environment Variables
- [ ] ทดสอบใน Browser
- [ ] ทดสอบใน Line App
- [ ] ตรวจสอบการทำงาน

## 🔐 **Security Notes**

1. **LIFF ID**: เก็บเป็นความลับ ไม่เปิดเผยในโค้ด
2. **Endpoint URL**: ใช้ HTTPS ใน production
3. **Scopes**: ขอเฉพาะที่จำเป็น
4. **User Data**: เก็บข้อมูลผู้ใช้อย่างปลอดภัย

## 🎯 **Best Practices**

1. **ตรวจสอบ LIFF**: ตรวจสอบว่า LIFF พร้อมใช้งานก่อนใช้งาน
2. **Error Handling**: จัดการ error อย่างเหมาะสม
3. **User Experience**: ให้ประสบการณ์ที่ดีทั้งในและนอก Line App
4. **Performance**: โหลดข้อมูลอย่างมีประสิทธิภาพ

---

**หมายเหตุ**: สำหรับ Production ต้องเปลี่ยน Endpoint URL และใช้ HTTPS
