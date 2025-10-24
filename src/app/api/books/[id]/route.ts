import { NextRequest, NextResponse } from 'next/server';
import { supabaseSimpleDb as db } from '@/lib/supabase-simple';

// GET /api/books/[id] - ดึงหนังสือตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await db.getBookById(id);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหนังสือที่ต้องการ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - อัปเดตหนังสือ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedBook = await db.updateBook(id, body);
    
    if (!updatedBook) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหนังสือที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: 'อัปเดตหนังสือสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตหนังสือ' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - ลบหนังสือ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await db.deleteBook(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหนังสือที่ต้องการลบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบหนังสือสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบหนังสือ' },
      { status: 500 }
    );
  }
}
