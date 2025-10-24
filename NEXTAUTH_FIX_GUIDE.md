# 🔧 แก้ไขปัญหา NextAuth.js "CLIENT_FETCH_ERROR"

## ❌ **ปัญหาที่พบ**
```
[next-auth][error][CLIENT_FETCH_ERROR] "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

## 🔍 **สาเหตุของปัญหา**

1. **NextAuth.js พยายาม parse HTML response เป็น JSON**
2. **API routes ไม่ได้ return JSON response ที่ถูกต้อง**
3. **Environment variables ไม่ครบหรือไม่ถูกต้อง**
4. **Line authentication configuration ไม่สมบูรณ์**

## ✅ **วิธีแก้ไข**

### **ขั้นตอนที่ 1: ตรวจสอบ Environment Variables**

ไปที่ `http://localhost:3000/api/debug-env` เพื่อตรวจสอบการตั้งค่า

### **ขั้นตอนที่ 2: ตั้งค่า Environment Variables**

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `digital-library/`:

```env
# NextAuth.js Configuration (จำเป็น)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (ถ้าต้องการ)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Line Login API (ถ้าต้องการ)
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token

# Supabase (ถ้าต้องการ)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **ขั้นตอนที่ 3: รีสตาร์ทเซิร์ฟเวอร์**

```bash
npm run dev
```

### **ขั้นตอนที่ 4: ทดสอบการทำงาน**

1. **ตรวจสอบ Environment**: `http://localhost:3000/api/debug-env`
2. **ทดสอบ Google Login**: `http://localhost:3000/auth/signin`
3. **ทดสอบ Line Login**: `http://localhost:3000/auth/line`

## 🔧 **การแก้ไขเพิ่มเติม**

### **หากยังมีปัญหา NextAuth:**

1. **ลบไฟล์ cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **ตรวจสอบ NextAuth configuration:**
   - ไฟล์ `src/lib/auth.ts`
   - ไฟล์ `src/app/api/auth/[...nextauth]/route.ts`

3. **ตรวจสอบ API routes:**
   - ไฟล์ `src/app/api/auth/callback/line/route.ts`
   - ไฟล์ `src/app/api/debug-env/route.ts`

### **หากยังมีปัญหา Line Login:**

1. **ตรวจสอบ Line Console:**
   - Channel เปิดใช้งานแล้ว
   - Callback URL ถูกต้อง: `http://localhost:3000/api/auth/callback/line`
   - Scopes ครบ: `openid`, `profile`, `email`

2. **ตรวจสอบ Environment Variables:**
   - `LINE_CHANNEL_ID`
   - `LINE_CHANNEL_SECRET`
   - `LINE_CHANNEL_ACCESS_TOKEN`

## 🚨 **ปัญหาที่อาจเกิดขึ้น**

### **Error: CLIENT_FETCH_ERROR**

**สาเหตุ**: NextAuth.js ไม่สามารถ parse response ได้

**วิธีแก้**:
1. ตรวจสอบ API routes ให้ return JSON
2. ตรวจสอบ environment variables
3. รีสตาร์ทเซิร์ฟเวอร์

### **Error: Unexpected token '<'**

**สาเหตุ**: API route return HTML แทน JSON

**วิธีแก้**:
1. ตรวจสอบ API route implementation
2. ตรวจสอบ error handling
3. ตรวจสอบ response format

### **Error: Configuration**

**สาเหตุ**: Environment variables ไม่ครบ

**วิธีแก้**:
1. ตรวจสอบไฟล์ `.env.local`
2. ตรวจสอบชื่อตัวแปร
3. ตรวจสอบค่าที่ใส่

## 📚 **ไฟล์ที่เกี่ยวข้อง**

- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `src/app/api/auth/callback/line/route.ts` - Line callback
- `src/app/api/debug-env/route.ts` - Environment debug
- `src/app/auth/error/page.tsx` - Error page

## 🔗 **ลิงก์ที่มีประโยชน์**

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Line Login API Documentation](https://developers.line.biz/en/docs/line-login/)
- [Environment Variables Guide](ENV_SETUP_GUIDE.md)

---

**หมายเหตุ**: ตรวจสอบ console logs เพื่อดู error details เพิ่มเติม
