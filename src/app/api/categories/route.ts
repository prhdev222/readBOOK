import { NextRequest, NextResponse } from 'next/server';
import { supabaseSimpleDb as db } from '@/lib/supabase-simple';

// GET /api/categories - ดึงหมวดหมู่ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const categories = await db.getAllCategories();
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' },
      { status: 500 }
    );
  }
}

// POST /api/categories - เพิ่มหมวดหมู่ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.name || !body.color || !body.icon) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็น (name, color, icon)' },
        { status: 400 }
      );
    }

    // สร้างหมวดหมู่ใหม่
    const newCategory = await db.addCategory({
      name: body.name,
      color: body.color,
      icon: body.icon
    });

    if (!newCategory) {
      return NextResponse.json(
        { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'เพิ่มหมวดหมู่สำเร็จ'
    });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่' },
      { status: 500 }
    );
  }
}
