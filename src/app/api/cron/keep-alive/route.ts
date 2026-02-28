import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Keep-alive สำหรับ Supabase Free Tier
 * เรียก endpoint นี้ทุก 5–6 วัน (ผ่าน cron) เพื่อให้โปรเจกต์ไม่ถูกพัก (pause)
 *
 * ตั้งค่า cron ฟรีได้ที่:
 * - https://cron-job.org
 * - https://uptimerobot.com (Monitor แบบ HTTP)
 * - Vercel Cron (ถ้าใช้ Vercel Pro)
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET(request: NextRequest) {
  // ป้องกันให้เฉพาะ cron ที่รู้ secret เรียกได้ (แนะนำให้ตั้ง CRON_SECRET ใน .env)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Query เล็กน้อยเพื่อให้ Supabase นับว่าเป็น activity
    const { error } = await supabase.from('categories').select('id').limit(1).maybeSingle();
    if (error) {
      console.error('[keep-alive] Supabase error:', error.message);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      message: 'Supabase keep-alive succeeded',
      at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[keep-alive] Error:', e);
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  }
}
