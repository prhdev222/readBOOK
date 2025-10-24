import { NextRequest, NextResponse } from 'next/server';
import { supabaseSimpleDb as db } from '@/lib/supabase-simple';

// GET /api/statistics - ดึงสถิติระบบ
export async function GET(request: NextRequest) {
  try {
    // ตรวจสอบ environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Supabase configuration is missing',
        details: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables',
        recommendations: [
          'Create a Supabase project at https://supabase.com',
          'Get your project URL and anon key from the project settings',
          'Add them to your .env.local file'
        ]
      }, { status: 500 });
    }

    const statistics = await db.getStatistics();
    
    return NextResponse.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Statistics API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงสถิติ',
      details: error instanceof Error ? error.message : 'Unknown error',
      recommendations: [
        'Check your Supabase configuration',
        'Verify database tables exist',
        'Check network connection'
      ]
    }, { status: 500 });
  }
}
