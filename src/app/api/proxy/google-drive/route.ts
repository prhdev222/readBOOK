import { NextResponse } from 'next/server';

// Proxy สตรีมไฟล์จาก Google Drive เพื่อลดปัญหา CSP และอนุญาต Range
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const sourceUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(
    id
  )}&export=download`;

  const range = request.headers.get('range') || undefined;

  const res = await fetch(sourceUrl, {
    headers: {
      ...(range ? { Range: range } : {}),
      // บางครั้งต้องการ referer/user-agent ให้เหมือนเบราว์เซอร์
      'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
      Referer: 'https://drive.google.com/',
    },
  });

  const headers = new Headers();
  // ส่งผ่าน header สำคัญสำหรับ media streaming
  const passThrough = [
    'content-type',
    'content-length',
    'accept-ranges',
    'content-range',
    'etag',
    'last-modified',
  ];
  passThrough.forEach((h) => {
    const v = res.headers.get(h);
    if (v) headers.set(h, v);
  });

  // Caching เล็กน้อยเพื่อประสิทธิภาพ (ปรับตามต้องการ)
  headers.set('Cache-Control', 'public, max-age=60');

  // อนุญาต cross-origin หากต้องใช้ภายนอก (ไม่จำเป็นภายในแอป)
  headers.set('Access-Control-Allow-Origin', '*');

  return new NextResponse(res.body, {
    status: res.status,
    headers,
  });
}


