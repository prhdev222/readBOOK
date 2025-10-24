import { NextRequest, NextResponse } from 'next/server';
import { supabaseSimpleDb as db } from '@/lib/supabase-simple';

// GET /api/categories/[id] - ดึงหมวดหมู่ตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categories = await db.getAllCategories();
    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหมวดหมู่ที่ต้องการ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - อัปเดตหมวดหมู่
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.name || !body.color || !body.icon) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็น (name, color, icon)' },
        { status: 400 }
      );
    }

    // อัปเดตหมวดหมู่
    const updatedCategory = await db.updateCategory(id, {
      name: body.name,
      color: body.color,
      icon: body.icon
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหมวดหมู่ที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'อัปเดตหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - ลบหมวดหมู่
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await db.deleteCategory(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหมวดหมู่ที่ต้องการลบ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบหมวดหมู่' },
      { status: 500 }
    );
  }
}
