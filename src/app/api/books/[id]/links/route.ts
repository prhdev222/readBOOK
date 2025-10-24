import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { validateLink } from '@/lib/link-utils';

// GET /api/books/[id]/links - ดึงลิงก์ทั้งหมดของหนังสือ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const links = await db.getBookLinks(id);
    
    return NextResponse.json({
      success: true,
      data: links
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลลิงก์' },
      { status: 500 }
    );
  }
}

// POST /api/books/[id]/links - เพิ่มลิงก์ให้หนังสือ
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.url) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุ URL ลิงก์' },
        { status: 400 }
      );
    }

    // ตรวจสอบความถูกต้องของลิงก์
    const validation = validateLink(body.url);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // เพิ่มลิงก์
    const newLink = await db.addLinkToBook(id, {
      type: body.type || 'other',
      url: body.url,
      title: body.title || 'ลิงก์ใหม่',
      description: body.description,
      isPrimary: body.isPrimary || false,
      isActive: true
    });

    if (!newLink) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหนังสือที่ต้องการเพิ่มลิงก์' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newLink,
      message: 'เพิ่มลิงก์สำเร็จ'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มลิงก์' },
      { status: 500 }
    );
  }
}
