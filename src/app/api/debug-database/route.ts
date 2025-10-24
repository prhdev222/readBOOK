import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // ตรวจสอบการเชื่อมต่อ Supabase
    const { data, error } = await supabase
      .from('books')
      .select('count', { count: 'exact' })
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    // ตรวจสอบ tables ที่มีอยู่
    const tables = ['books', 'book_links', 'categories'];
    const tableStatus: Record<string, any> = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact' })
          .limit(1);
        
        tableStatus[table] = {
          exists: !error,
          error: error?.message || null,
          count: data?.length || 0
        };
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          count: 0
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      environment: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV
      },
      tables: tableStatus,
      recommendations: {
        missingTables: Object.entries(tableStatus)
          .filter(([_, status]) => !status.exists)
          .map(([table]) => table),
        setupRequired: !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}
