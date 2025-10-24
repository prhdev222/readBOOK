import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // ส่งข้อมูล user ID ไปยัง session
      if (session.user && token) {
        (session.user as any).id = token.sub || '';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // เพิ่มการจัดการ error
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign in event:', { user, account, profile, isNewUser });
    },
    async signOut({ session, token }) {
      console.log('Sign out event:', { session, token });
    },
    async createUser({ user }) {
      console.log('Create user event:', { user });
    },
    async linkAccount({ user, account, profile }) {
      console.log('Link account event:', { user, account, profile });
    },
    async session({ session, token }) {
      console.log('Session event:', { session, token });
    },
  },
};
