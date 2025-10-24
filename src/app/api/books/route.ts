import { NextRequest, NextResponse } from 'next/server';
import { supabaseSimpleDb as db } from '@/lib/supabase-simple';
import { Book } from '@/types';

// GET /api/books - ดึงหนังสือทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // ค้นหาหนังสือ
    const books = await db.searchBooks(query, category);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = books.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        books: paginatedBooks,
        pagination: {
          page,
          limit,
          total: books.length,
          totalPages: Math.ceil(books.length / limit)
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ' },
      { status: 500 }
    );
  }
}

// POST /api/books - เพิ่มหนังสือใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.title || !body.author || !body.category) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลที่จำเป็น (title, author, category)' },
        { status: 400 }
      );
    }

    // สร้างหนังสือใหม่
    const newBook = await db.addBook({
      title: body.title,
      author: body.author,
      description: body.description || '',
      coverImage: body.coverImage,
      category: body.category,
      tags: body.tags || [],
      publishedDate: body.publishedDate,
      isbn: body.isbn,
      language: body.language || 'ไทย',
      pages: body.pages,
      fileSize: body.fileSize,
      links: body.links || []
    });

    return NextResponse.json({
      success: true,
      data: newBook,
      message: 'เพิ่มหนังสือสำเร็จ'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มหนังสือ' },
      { status: 500 }
    );
  }
}
