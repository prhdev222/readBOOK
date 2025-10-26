# คู่มือการใช้งานระบบสื่อใน Digital Library

## ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

ระบบ Digital Library ตอนนี้รองรับสื่อประเภทต่างๆ นอกเหนือจากหนังสือแล้ว ได้แก่:

### 1. ประเภทสื่อที่รองรับ

#### 📁 ไฟล์ทั่วไป
- Google Drive, Dropbox, OneDrive, MEGA, MediaFire
- Direct Link สำหรับไฟล์ที่อัปโหลดโดยตรง

#### 🖼️ รูปภาพ
- รองรับการแสดงรูปภาพแบบ inline
- มี thumbnail preview
- คลิกเพื่อดูรูปภาพขนาดเต็ม

#### 🎵 เสียง/MP3
- Audio player ในตัว
- แสดงความยาวของไฟล์เสียง
- Controls สำหรับเล่น/หยุด/ปรับระดับเสียง

#### 🎬 วิดีโอ
- Video player ในตัว
- รองรับ thumbnail poster
- Controls สำหรับเล่น/หยุด/ปรับระดับเสียง

#### 📺 YouTube
- แสดง YouTube video แบบ embed
- รองรับ YouTube URL ทุกรูปแบบ
- Auto-detect YouTube video ID

#### 📄 เอกสาร
- รองรับไฟล์เอกสารต่างๆ
- แสดงข้อมูลไฟล์ (ขนาด, ประเภท)

### 2. วิธีการเพิ่มสื่อใหม่

#### สำหรับ Admin:
1. เข้าไปที่หน้า Admin > Books > Add New Book
2. ในส่วน "Download Links" เลือกประเภทสื่อที่ต้องการ
3. กรอกข้อมูลเพิ่มเติม:
   - **Media Type**: เลือกประเภทสื่อ (ไฟล์, รูปภาพ, เสียง, วิดีโอ, YouTube, เอกสาร)
   - **URL**: ลิงก์ไปยังสื่อ
   - **Thumbnail URL**: รูปภาพตัวอย่าง (ไม่บังคับ)
   - **Duration**: ความยาวในวินาที (สำหรับเสียง/วิดีโอ)
   - **File Size**: ขนาดไฟล์ใน bytes
   - **MIME Type**: ประเภทไฟล์ (เช่น image/jpeg, audio/mp3)
   - **Description**: คำอธิบายเพิ่มเติม

#### ตัวอย่างการใช้งาน:

**YouTube Video:**
- Type: YouTube
- Media Type: YouTube
- URL: https://www.youtube.com/watch?v=VIDEO_ID
- Thumbnail URL: (จะ auto-generate จาก YouTube)

**รูปภาพ:**
- Type: image
- Media Type: image
- URL: https://example.com/image.jpg
- Thumbnail URL: https://example.com/thumb.jpg

**ไฟล์เสียง:**
- Type: direct
- Media Type: audio
- URL: https://example.com/audio.mp3
- Duration: 180 (3 นาที)
- MIME Type: audio/mpeg

### 3. การแสดงผลสำหรับผู้ใช้

#### หน้าแสดงรายละเอียดหนังสือ:
- แสดงสื่อทั้งหมดในรูปแบบ card
- แต่ละประเภทสื่อจะมี player/display ที่เหมาะสม
- แสดงข้อมูลเพิ่มเติม (ความยาว, ขนาดไฟล์)
- รองรับการจัดกลุ่มสื่อ (ในอนาคต)

#### ฟีเจอร์พิเศษ:
- **Auto-detect**: ระบบจะพยายาม detect ประเภทสื่อจาก URL
- **Responsive**: รองรับการแสดงผลบนมือถือ
- **Accessibility**: รองรับการใช้งานด้วย keyboard

### 4. การตั้งค่าฐานข้อมูล

#### Migration Script:
ใช้ไฟล์ `supabase-media-migration.sql` เพื่ออัปเดตฐานข้อมูล:

```sql
-- รัน migration script นี้ใน Supabase SQL Editor
-- หรือใช้ Supabase CLI
```

#### ตารางที่เพิ่มเข้ามา:
- `media_collections`: สำหรับจัดกลุ่มสื่อ
- `media_view`: View สำหรับดูข้อมูลสื่อแบบรวม

### 5. การ Customize

#### MediaPlayer Component:
ไฟล์ `src/components/MediaPlayer.tsx` สามารถปรับแต่งได้:
- เพิ่ม player ใหม่
- เปลี่ยน UI/UX
- เพิ่มฟีเจอร์ใหม่

#### Styling:
ใช้ Tailwind CSS classes ที่สามารถปรับแต่งได้ตามต้องการ

### 6. ตัวอย่างการใช้งานจริง

#### เพิ่มหนังสือพร้อมสื่อ:
1. เพิ่มข้อมูลหนังสือพื้นฐาน
2. เพิ่มลิงก์ดาวน์โหลด PDF
3. เพิ่ม YouTube video ที่เกี่ยวข้อง
4. เพิ่มรูปภาพประกอบ
5. เพิ่มไฟล์เสียง (audiobook)

#### ผลลัพธ์:
ผู้ใช้จะเห็นสื่อทั้งหมดในหน้าเดียว สามารถ:
- อ่านหนังสือ (PDF)
- ดูวิดีโอ (YouTube)
- ดูรูปภาพประกอบ
- ฟังเสียงบรรยาย

### 7. การแก้ไขปัญหา

#### ปัญหาที่อาจพบ:
1. **YouTube ไม่แสดง**: ตรวจสอบ URL format
2. **รูปภาพไม่โหลด**: ตรวจสอบ URL และ CORS
3. **Audio/Video ไม่เล่น**: ตรวจสอบ MIME type และ browser support

#### การ Debug:
- เปิด Developer Tools
- ดู Console สำหรับ error messages
- ตรวจสอบ Network tab สำหรับ failed requests

### 8. การพัฒนาต่อ

#### ฟีเจอร์ที่สามารถเพิ่มได้:
- การจัดกลุ่มสื่อ (Collections)
- การค้นหาสื่อ
- การแชร์สื่อ
- การดาวน์โหลดแบบ batch
- การแสดงสถิติการใช้งาน

#### การปรับปรุง:
- เพิ่ม player types ใหม่
- ปรับปรุง UI/UX
- เพิ่ม accessibility features
- ปรับปรุง performance

---

## สรุป

ระบบสื่อใหม่นี้ทำให้ Digital Library สามารถรองรับเนื้อหาที่หลากหลายมากขึ้น ไม่เพียงแค่หนังสือ แต่ยังรวมถึงสื่อประเภทต่างๆ ที่สามารถเพิ่มคุณค่าให้กับประสบการณ์การเรียนรู้อีกด้วย
