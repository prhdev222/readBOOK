import { NextResponse } from 'next/server';
import { clearAdminAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    await clearAdminAuthCookie();
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}