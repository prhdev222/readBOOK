# 📚 readBOOK - Digital Library

ห้องสมุดดิจิทัลสำหรับอ่านหนังสือออนไลน์ พัฒนาด้วย Next.js 14 และ Supabase

## 🚀 **Features**

- 📖 **ดูรายการหนังสือ** - แสดงหนังสือทั้งหมดพร้อมหมวดหมู่
- 🔍 **ค้นหาหนังสือ** - ค้นหาด้วยชื่อ, ผู้แต่ง, หรือหมวดหมู่
- 📥 **ดาวน์โหลดไฟล์** - ดาวน์โหลด PDF มาอ่านในเครื่อง
- 📱 **Responsive Design** - ใช้งานได้ทุกอุปกรณ์
- 🎨 **Modern UI** - ออกแบบด้วย Tailwind CSS

## 🛠 **Tech Stack**

- **Frontend:** Next.js 14, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **File Storage:** Google Drive

## 📦 **Installation**

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/readbook-digital-library.git
cd readbook-digital-library
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Variables**
สร้างไฟล์ `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **4. Run Development Server**
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 🗄 **Database Setup**

### **1. สร้าง Supabase Project**
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. ไปที่ SQL Editor

### **2. รัน SQL Script**
คัดลอกโค้ดจากไฟล์ `supabase-fixed.sql` และรันใน SQL Editor

### **3. ตั้งค่า Environment Variables**
คัดลอก Project URL และ anon key ไปใส่ใน `.env.local`

## 🚀 **Deployment**

### **Deploy ไป Vercel:**
1. ติดตั้ง Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. ตั้งค่า Environment Variables ใน Vercel Dashboard

ดูรายละเอียดใน [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📱 **LINE Mini App (Coming Soon)**

โปรเจคนี้รองรับการพัฒนาเป็น LINE Mini App:
- ดาวน์โหลดไฟล์ใน LINE ได้
- แชร์หนังสือให้เพื่อนได้
- Push notification เมื่อมีหนังสือใหม่

ดูรายละเอียดใน [line-mini-app-setup.md](./line-mini-app-setup.md)

## 📁 **Project Structure**

```
src/
├── app/
│   ├── books/
│   │   ├── page.tsx          # รายการหนังสือ
│   │   └── [id]/
│   │       └── page.tsx      # รายละเอียดหนังสือ
│   ├── search/
│   │   └── page.tsx          # ค้นหาหนังสือ
│   ├── admin/                # Admin panel
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── lib/
│   └── supabase.ts           # Supabase client
└── components/               # Reusable components
```

## 🔧 **Development**

### **Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### **Database Schema:**
- `books` - ข้อมูลหนังสือ
- `book_links` - ลิงก์ดาวน์โหลด
- `categories` - หมวดหมู่หนังสือ

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

หากมีปัญหาหรือคำถาม:
- สร้าง Issue ใน GitHub
- ติดต่อผ่าน LINE OA (Coming Soon)

## 🎯 **Roadmap**

- [ ] LINE Mini App integration
- [ ] User authentication
- [ ] Bookmark system
- [ ] Reading progress tracking
- [ ] Social sharing features
- [ ] Mobile app (React Native)

---

**Made with ❤️ by readBOOK Team**