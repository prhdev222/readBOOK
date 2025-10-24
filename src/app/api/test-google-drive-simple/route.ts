import { NextRequest, NextResponse } from 'next/server';

// GET /api/test-google-drive-simple - ทดสอบ Google Drive credentials แบบง่าย
export async function GET(request: NextRequest) {
  try {
    console.log('Testing Google Drive credentials...');
    
    // ตรวจสอบ environment variables
    const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
    const folderId = process.env.GOOGLE_DRIVE_DB_FOLDER_ID;

    console.log('Environment variables:');
    console.log('- CLIENT_EMAIL:', clientEmail ? '✅ Set' : '❌ Missing');
    console.log('- PRIVATE_KEY:', privateKey ? `✅ Set (${privateKey.length} chars)` : '❌ Missing');
    console.log('- FOLDER_ID:', folderId ? '✅ Set' : '❌ Missing');

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    const hasAllCredentials = !!(clientEmail && privateKey && folderId);

    if (hasAllCredentials) {
      return NextResponse.json({
        success: true,
        message: 'Google Drive credentials are properly configured',
        data: {
          clientEmail: clientEmail,
          folderId: folderId,
          hasPrivateKey: !!privateKey,
          privateKeyLength: privateKey?.length || 0,
          privateKeyStart: privateKey?.substring(0, 50) + '...',
          privateKeyEnd: '...' + privateKey?.substring(privateKey.length - 50)
        }
      });
    } else {
      const missing = [];
      if (!clientEmail) missing.push('GOOGLE_DRIVE_CLIENT_EMAIL');
      if (!privateKey) missing.push('GOOGLE_DRIVE_PRIVATE_KEY');
      if (!folderId) missing.push('GOOGLE_DRIVE_DB_FOLDER_ID');

      return NextResponse.json({
        success: false,
        error: 'Missing Google Drive credentials',
        message: `ไม่พบ Google Drive credentials: ${missing.join(', ')}`,
        missing: missing,
        current: {
          clientEmail: !!clientEmail,
          privateKey: !!privateKey,
          folderId: !!folderId
        }
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Google Drive test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'เกิดข้อผิดพลาดในการทดสอบ Google Drive',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
