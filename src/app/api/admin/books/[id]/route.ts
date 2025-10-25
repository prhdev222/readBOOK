import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, author, description, category, language, links } = body;

    // Update book
    const { error: bookError } = await supabase
      .from('books')
      .update({
        title,
        author,
        description: description || null,
        category,
        language,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (bookError) {
      return NextResponse.json({ error: 'Failed to update book' }, { status: 400 });
    }

    // Handle links - delete existing and insert new ones
    const { error: deleteError } = await supabase
      .from('book_links')
      .delete()
      .eq('book_id', params.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to update links' }, { status: 400 });
    }

    // Insert new links if provided
    if (links && links.length > 0) {
      const validLinks = links.filter((link: any) => link.url && link.title);
      if (validLinks.length > 0) {
        const linksWithBookId = validLinks.map((link: any) => ({
          book_id: params.id,
          type: link.type,
          url: link.url,
          title: link.title,
          is_primary: link.is_primary,
          is_active: true
        }));

        const { error: linksError } = await supabase
          .from('book_links')
          .insert(linksWithBookId);

        if (linksError) {
          return NextResponse.json({ error: 'Failed to update links' }, { status: 400 });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete book links first
    const { error: linksError } = await supabase
      .from('book_links')
      .delete()
      .eq('book_id', params.id);

    if (linksError) {
      return NextResponse.json({ error: 'Failed to delete book links' }, { status: 400 });
    }

    // Delete book
    const { error: bookError } = await supabase
      .from('books')
      .delete()
      .eq('id', params.id);

    if (bookError) {
      return NextResponse.json({ error: 'Failed to delete book' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
