import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { validateLink } from '@/lib/link-utils';

// PUT /api/links/[linkId] - อัปเดตลิงก์
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;
    const body = await request.json();
    
    // ตรวจสอบ URL หากมีการเปลี่ยนแปลง
    if (body.url) {
      const validation = validateLink(body.url);
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }

    const updatedLink = await db.updateLink(linkId, body);
    
    if (!updatedLink) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบลิงก์ที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLink,
      message: 'อัปเดตลิงก์สำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตลิงก์' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[linkId] - ลบลิงก์
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;
    const success = await db.deleteLink(linkId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบลิงก์ที่ต้องการลบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบลิงก์สำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบลิงก์' },
      { status: 500 }
    );
  }
}
