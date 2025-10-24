import { NextRequest, NextResponse } from 'next/server';
// import { googleDriveService } from '@/lib/google-drive';

// GET /api/test-google-drive - ทดสอบการเชื่อมต่อ Google Drive
export async function GET(request: NextRequest) {
  try {
    // ตรวจสอบ environment variables
    const requiredEnvVars = [
      'GOOGLE_DRIVE_CLIENT_EMAIL',
      'GOOGLE_DRIVE_PRIVATE_KEY',
      'GOOGLE_DRIVE_DB_FOLDER_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing environment variables: ${missingVars.join(', ')}`,
        message: 'กรุณาตั้งค่า environment variables ใน .env.local'
      }, { status: 400 });
    }

    // ทดสอบการเชื่อมต่อ Google Drive แบบง่าย
    // ตรวจสอบเฉพาะ environment variables
    const hasAllCredentials = !!(
      process.env.GOOGLE_DRIVE_CLIENT_EMAIL &&
      process.env.GOOGLE_DRIVE_PRIVATE_KEY &&
      process.env.GOOGLE_DRIVE_DB_FOLDER_ID
    );

    if (hasAllCredentials) {
      return NextResponse.json({
        success: true,
        message: 'Google Drive credentials are configured',
        data: {
          clientEmail: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
          folderId: process.env.GOOGLE_DRIVE_DB_FOLDER_ID,
          hasPrivateKey: !!process.env.GOOGLE_DRIVE_PRIVATE_KEY,
          privateKeyLength: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.length || 0
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Missing Google Drive credentials',
        message: 'ไม่พบ Google Drive credentials ใน .env.local',
        missing: {
          clientEmail: !process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
          privateKey: !process.env.GOOGLE_DRIVE_PRIVATE_KEY,
          folderId: !process.env.GOOGLE_DRIVE_DB_FOLDER_ID
        }
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Google Drive test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'เกิดข้อผิดพลาดในการทดสอบ Google Drive'
    }, { status: 500 });
  }
}
