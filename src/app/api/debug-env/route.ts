import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ตรวจสอบ environment variables ที่จำเป็น
    const envCheck = {
      // NextAuth
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      
      // Google OAuth
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      
      // Line API
      LINE_CHANNEL_ID: !!process.env.LINE_CHANNEL_ID,
      LINE_CHANNEL_SECRET: !!process.env.LINE_CHANNEL_SECRET,
      LINE_CHANNEL_ACCESS_TOKEN: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
      
      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      
      // Google Drive
      GOOGLE_DRIVE_CLIENT_EMAIL: !!process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      GOOGLE_DRIVE_PRIVATE_KEY: !!process.env.GOOGLE_DRIVE_PRIVATE_KEY,
      GOOGLE_DRIVE_DB_FOLDER_ID: !!process.env.GOOGLE_DRIVE_DB_FOLDER_ID,
    };

    // นับจำนวน environment variables ที่ตั้งค่าแล้ว
    const configuredCount = Object.values(envCheck).filter(Boolean).length;
    const totalCount = Object.keys(envCheck).length;

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      configured: configuredCount,
      total: totalCount,
      percentage: Math.round((configuredCount / totalCount) * 100),
      details: envCheck,
      recommendations: {
        critical: [
          !envCheck.NEXTAUTH_URL && 'NEXTAUTH_URL is required',
          !envCheck.NEXTAUTH_SECRET && 'NEXTAUTH_SECRET is required',
        ].filter(Boolean),
        recommended: [
          !envCheck.GOOGLE_CLIENT_ID && 'GOOGLE_CLIENT_ID for Google OAuth',
          !envCheck.LINE_CHANNEL_ID && 'LINE_CHANNEL_ID for Line Login',
          !envCheck.NEXT_PUBLIC_SUPABASE_URL && 'NEXT_PUBLIC_SUPABASE_URL for database',
        ].filter(Boolean),
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}