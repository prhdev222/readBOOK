import { Client } from '@line/bot-sdk';

// Check if Line configuration is complete
export const isLineConfigured = () => {
  try {
    return !!(
      process.env.LINE_CHANNEL_ID && 
      process.env.LINE_CHANNEL_SECRET && 
      process.env.LINE_CHANNEL_ACCESS_TOKEN
    );
  } catch (error) {
    console.warn('Error checking Line configuration:', error);
    return false;
  }
};

// Line Login Configuration (only create if config is available)
export const getLineConfig = () => {
  try {
    if (!isLineConfigured()) {
      return null;
    }
    return {
      channelId: process.env.LINE_CHANNEL_ID!,
      channelSecret: process.env.LINE_CHANNEL_SECRET!,
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    };
  } catch (error) {
    console.warn('Error getting Line configuration:', error);
    return null;
  }
};

// Line Bot Client (only create if config is available)
export const lineClient = (() => {
  try {
    const config = getLineConfig();
    if (config) {
      return new Client(config);
    }
    console.warn('Line configuration is incomplete. Please set LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, and LINE_CHANNEL_ACCESS_TOKEN in your environment variables.');
    return null;
  } catch (error) {
    console.warn('Line client initialization failed:', error);
    return null;
  }
})();

// Alternative: Lazy initialization
export const getLineClient = () => {
  try {
    const config = getLineConfig();
    if (config) {
      return new Client(config);
    }
    return null;
  } catch (error) {
    console.warn('Line client initialization failed:', error);
    return null;
  }
};

// Line Login URL Generator
export function generateLineLoginUrl(state?: string): string {
  if (!isLineConfigured()) {
    throw new Error('Line configuration is incomplete. Please set LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, and LINE_CHANNEL_ACCESS_TOKEN in your environment variables.');
  }

  const baseUrl = 'https://access.line.me/oauth2/v2.1/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CHANNEL_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/line`,
    state: state || 'line-login',
    scope: 'profile openid email',
  });

  return `${baseUrl}?${params.toString()}`;
}

// Exchange Authorization Code for Access Token
export async function exchangeCodeForToken(code: string): Promise<any> {
  if (!isLineConfigured()) {
    throw new Error('Line configuration is incomplete. Please set LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, and LINE_CHANNEL_ACCESS_TOKEN in your environment variables.');
  }

  const tokenUrl = 'https://api.line.me/oauth2/v2.1/token';
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/line`,
      client_id: process.env.LINE_CHANNEL_ID!,
      client_secret: process.env.LINE_CHANNEL_SECRET!,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return await response.json();
}

// Get User Profile from Line
export async function getLineUserProfile(accessToken: string): Promise<any> {
  const profileUrl = 'https://api.line.me/v2/profile';
  
  const response = await fetch(profileUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }

  return await response.json();
}

// Verify ID Token
export async function verifyLineIdToken(idToken: string): Promise<any> {
  if (!isLineConfigured()) {
    throw new Error('Line configuration is incomplete. Please set LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, and LINE_CHANNEL_ACCESS_TOKEN in your environment variables.');
  }

  const verifyUrl = 'https://api.line.me/oauth2/v2.1/verify';
  
  const response = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      id_token: idToken,
      client_id: process.env.LINE_CHANNEL_ID!,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify ID token');
  }

  return await response.json();
}
