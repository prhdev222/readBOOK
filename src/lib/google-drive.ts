// ใช้ dynamic import เพื่อหลีกเลี่ยงปัญหา client-side
// import { google } from 'googleapis';

// Google Drive Service
export class GoogleDriveService {
  private drive: any;
  private folderId: string;

  constructor() {
    this.folderId = process.env.GOOGLE_DRIVE_DB_FOLDER_ID || '';
    // ไม่เรียก initializeDrive ใน constructor เพื่อหลีกเลี่ยงปัญหา
  }

  private async initializeDrive() {
    try {
      // ใช้ dynamic import เพื่อหลีกเลี่ยงปัญหา client-side
      const { google } = await import('googleapis');
      
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      this.drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      console.error('Error initializing Google Drive:', error);
    }
  }

  // อัปโหลดไฟล์ไป Google Drive
  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string = 'application/pdf'
  ): Promise<string | null> {
    try {
      if (!this.drive) {
        throw new Error('Google Drive not initialized');
      }

      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [this.folderId],
        },
        media: {
          mimeType,
          body: fileBuffer,
        },
      });

      return response.data.id;
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      return null;
    }
  }

  // สร้างลิงก์แชร์สำหรับไฟล์
  async createShareableLink(fileId: string): Promise<string | null> {
    try {
      if (!this.drive) {
        throw new Error('Google Drive not initialized');
      }

      // ตั้งค่าให้ทุกคนอ่านได้
      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // สร้างลิงก์แชร์
      const response = await this.drive.files.get({
        fileId,
        fields: 'webViewLink',
      });

      return response.data.webViewLink;
    } catch (error) {
      console.error('Error creating shareable link:', error);
      return null;
    }
  }

  // ลบไฟล์จาก Google Drive
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      if (!this.drive) {
        throw new Error('Google Drive not initialized');
      }

      await this.drive.files.delete({
        fileId,
      });

      return true;
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      return false;
    }
  }

  // ดึงข้อมูลไฟล์
  async getFileInfo(fileId: string): Promise<any | null> {
    try {
      if (!this.drive) {
        throw new Error('Google Drive not initialized');
      }

      const response = await this.drive.files.get({
        fileId,
        fields: 'id,name,size,createdTime,modifiedTime,webViewLink',
      });

      return response.data;
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  // ค้นหาไฟล์ในโฟลเดอร์
  async searchFiles(query: string): Promise<any[]> {
    try {
      if (!this.drive) {
        throw new Error('Google Drive not initialized');
      }

      const response = await this.drive.files.list({
        q: `'${this.folderId}' in parents and name contains '${query}'`,
        fields: 'files(id,name,size,createdTime,webViewLink)',
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error searching files:', error);
      return [];
    }
  }

  // ตรวจสอบการเชื่อมต่อ
  async testConnection(): Promise<boolean> {
    try {
      // ตรวจสอบ environment variables ก่อน
      if (!process.env.GOOGLE_DRIVE_CLIENT_EMAIL || 
          !process.env.GOOGLE_DRIVE_PRIVATE_KEY || 
          !process.env.GOOGLE_DRIVE_DB_FOLDER_ID) {
        return false;
      }

      // เริ่มต้น Google Drive client
      if (!this.drive) {
        await this.initializeDrive();
      }

      if (!this.drive) {
        return false;
      }

      // ลองดึงข้อมูลโฟลเดอร์
      const response = await this.drive.files.get({
        fileId: this.folderId,
        fields: 'id,name',
      });

      return !!response.data.id;
    } catch (error) {
      console.error('Google Drive connection test failed:', error);
      return false;
    }
  }
}

// สร้าง instance ของ Google Drive Service
export const googleDriveService = new GoogleDriveService();
