# การตั้งค่า Google Drive Service Account สำหรับ readBOOK

## 1. สร้าง Google Cloud Project

1. ไปที่ [Google Cloud Console](https://console.developers.google.com/)
2. คลิก "Select a project" หรือ "New Project"
3. สร้างโปรเจคใหม่หรือเลือกโปรเจคที่มีอยู่
4. ตั้งชื่อโปรเจค เช่น "readBOOK Digital Library"

## 2. เปิดใช้งาน Google Drive API

1. ใน Google Cloud Console ไปที่ "APIs & Services" > "Library"
2. ค้นหา "Google Drive API"
3. คลิก "Enable" เพื่อเปิดใช้งาน

## 3. สร้าง Service Account

1. ไปที่ "IAM & Admin" > "Service Accounts"
2. คลิก "Create Service Account"
3. ตั้งชื่อ Service Account เช่น "readbook-drive-service"
4. ใส่คำอธิบาย: "Service account for readBOOK Google Drive integration"
5. คลิก "Create and Continue"
6. ข้ามการตั้งค่า roles (ไม่จำเป็น)
7. คลิก "Done"

## 4. สร้าง JSON Key

1. ในหน้า Service Accounts คลิกที่ Service Account ที่สร้าง
2. ไปที่แท็บ "Keys"
3. คลิก "Add Key" > "Create new key"
4. เลือก "JSON" และคลิก "Create"
5. ไฟล์ JSON จะถูกดาวน์โหลดอัตโนมัติ
6. เก็บไฟล์นี้ไว้อย่างปลอดภัย

## 5. สร้างโฟลเดอร์ใน Google Drive

1. ไปที่ [Google Drive](https://drive.google.com/)
2. สร้างโฟลเดอร์ใหม่ เช่น "readBOOK Files"
3. คลิกขวาที่โฟลเดอร์ > "Share"
4. **สำคัญ**: แชร์โฟลเดอร์กับ Service Account email ที่ได้จากไฟล์ JSON
5. ตั้งสิทธิ์เป็น "Editor" หรือ "Content manager"
6. คัดลอก Folder ID จาก URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```

## 6. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```env
# Google Drive Configuration (Service Account)
GOOGLE_DRIVE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_DB_FOLDER_ID=your_folder_id_here
```

### วิธีการดึงข้อมูลจากไฟล์ JSON:

จากไฟล์ JSON ที่ดาวน์โหลดมา:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

- `client_email` → `GOOGLE_DRIVE_CLIENT_EMAIL`
- `private_key` → `GOOGLE_DRIVE_PRIVATE_KEY`

## 7. ทดสอบการเชื่อมต่อ

1. รัน development server: `npm run dev`
2. ไปที่ `http://localhost:3000/admin/test-google-drive`
3. ทดสอบการเชื่อมต่อและอัปโหลดไฟล์

## 8. การใช้งานใน Production

### Vercel Deployment

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจค readBOOK
3. ไปที่ Settings > Environment Variables
4. เพิ่มตัวแปรทั้งหมด:
   - `GOOGLE_DRIVE_CLIENT_EMAIL`
   - `GOOGLE_DRIVE_PRIVATE_KEY`
   - `GOOGLE_DRIVE_DB_FOLDER_ID`

### ข้อดีของ Service Account

- **ไม่ต้อง OAuth flow**: ไม่ต้องจัดการ redirect URI
- **ปลอดภัยกว่า**: ไม่ต้องเก็บ refresh token
- **ง่ายกว่า**: ตั้งค่าครั้งเดียวใช้ได้เลย
- **เหมาะสำหรับ server-to-server**: ไม่ต้อง user interaction

## 9. การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **"Invalid credentials" error**
   - ตรวจสอบ Service Account email และ private key
   - ตรวจสอบว่า private key มี `\n` ถูกต้อง

2. **"Access denied" error**
   - ตรวจสอบว่าแชร์โฟลเดอร์กับ Service Account email แล้ว
   - ตรวจสอบสิทธิ์การเข้าถึงโฟลเดอร์ (ต้องเป็น Editor หรือ Content manager)

3. **"Folder not found" error**
   - ตรวจสอบ Folder ID
   - ตรวจสอบว่าโฟลเดอร์ยังคงอยู่และไม่ถูกลบ

4. **"Quota exceeded" error**
   - Google Drive API มี quota limit
   - ตรวจสอบการใช้งานใน Google Cloud Console

### การตรวจสอบ

1. ตรวจสอบ API usage ใน Google Cloud Console
2. ตรวจสอบ logs ใน Vercel Dashboard
3. ใช้ Google Drive Test page ใน admin panel

## 10. Security Best Practices

1. **อย่าเปิดเผย Client Secret**
   - เก็บใน environment variables เท่านั้น
   - อย่า commit ลง git

2. **จำกัดสิทธิ์การเข้าถึง**
   - ใช้ scope ที่จำเป็นเท่านั้น
   - ตรวจสอบ permissions เป็นประจำ

3. **หมุนเวียน credentials**
   - เปลี่ยน refresh token เป็นประจำ
   - ตรวจสอบการใช้งานที่ผิดปกติ

## 11. การ Monitor และ Maintenance

1. **ตรวจสอบ API Usage**
   - ไปที่ Google Cloud Console > APIs & Services > Quotas
   - ตรวจสอบ daily quota usage

2. **Backup Strategy**
   - สำรองไฟล์สำคัญในที่อื่น
   - ใช้ version control สำหรับไฟล์สำคัญ

3. **Performance Optimization**
   - ใช้ compression สำหรับไฟล์ใหญ่
   - จำกัดขนาดไฟล์ที่อัปโหลด
