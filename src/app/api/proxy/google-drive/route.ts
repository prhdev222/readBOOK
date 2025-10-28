import { NextResponse } from 'next/server';

// Proxy สตรีมไฟล์จาก Google Drive เพื่อลดปัญหา CSP และอนุญาต Range
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // ลองหลาย URL patterns สำหรับ Google Drive
  const urlPatterns = [
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`,
    `https://docs.google.com/uc?export=download&id=${encodeURIComponent(id)}`,
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download`,
  ];

  const range = request.headers.get('range') || undefined;
  
  // ลองแต่ละ URL pattern จนกว่าจะสำเร็จ
  for (const sourceUrl of urlPatterns) {
    try {
      const res = await fetch(sourceUrl, {
        headers: {
          ...(range ? { Range: range } : {}),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://drive.google.com/',
          'Accept': '*/*',
        },
        redirect: 'follow',
      });

      // ถ้าได้ response ที่ดี (ไม่ใช่ HTML error page)
      if (res.ok && res.headers.get('content-type')?.includes('audio/')) {
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

        // CORS headers
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Range');
        headers.set('Cache-Control', 'public, max-age=3600');

        return new NextResponse(res.body, {
          status: res.status,
          headers,
        });
      }
    } catch (error) {
      console.log(`Failed to fetch from ${sourceUrl}:`, error);
      continue;
    }
  }

  // ถ้าทุก URL ล้มเหลว ให้ส่ง error
  return NextResponse.json({ 
    error: 'Unable to access Google Drive file. Please check file permissions.' 
  }, { status: 403 });
}


