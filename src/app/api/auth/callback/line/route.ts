import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getLineUserProfile, verifyLineIdToken } from '@/lib/line-auth';
import { createClient } from '@supabase/supabase-js';

// ใช้ placeholder values หากไม่มี environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // ตรวจสอบ error
    if (error) {
      console.error('Line login error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=${error}`);
    }

    // ตรวจสอบ authorization code
    if (!code) {
      console.error('Missing authorization code');
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=missing_code`);
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    const { access_token, id_token } = tokenResponse;

    if (!access_token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=no_access_token`);
    }

    // Get user profile from Line
    const userProfile = await getLineUserProfile(access_token);
    
    // Verify ID token (optional but recommended)
    let verifiedProfile = null;
    if (id_token) {
      try {
        verifiedProfile = await verifyLineIdToken(id_token);
      } catch (error) {
        console.warn('ID token verification failed:', error);
      }
    }

    // ใช้ข้อมูลจาก verified profile หรือ user profile
    const finalProfile = verifiedProfile || userProfile;

    // สร้างหรืออัปเดตผู้ใช้ใน Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        id: finalProfile.userId,
        email: finalProfile.email || `${finalProfile.userId}@line.local`,
        name: finalProfile.displayName,
        image: finalProfile.pictureUrl,
        provider: 'line',
        provider_id: finalProfile.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating/updating user:', userError);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=database_error`);
    }

    // สร้าง session token (simplified)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: finalProfile.userId,
      name: finalProfile.displayName,
      email: finalProfile.email || `${finalProfile.userId}@line.local`,
      image: finalProfile.pictureUrl,
      provider: 'line'
    })).toString('base64');

    // Redirect กลับไปหน้าหลักพร้อม session
    const redirectUrl = new URL('/', process.env.NEXTAUTH_URL);
    redirectUrl.searchParams.set('line_session', sessionToken);
    
    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Line login error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=line_login_failed`);
  }
}
