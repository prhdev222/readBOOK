import liff from '@line/liff';

// LIFF Configuration
export const LIFF_CONFIG = {
  liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
  endpoint: process.env.NEXT_PUBLIC_LIFF_ENDPOINT || 'https://liff.line.me',
};

// Initialize LIFF
export async function initializeLiff(): Promise<boolean> {
  try {
    await liff.init({ liffId: LIFF_CONFIG.liffId });
    return true;
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    return false;
  }
}

// Check if running in LINE app
export function isInLineApp(): boolean {
  return liff.isInClient();
}

// Get user profile
export async function getLiffProfile(): Promise<any> {
  try {
    if (!liff.isLoggedIn()) {
      throw new Error('User not logged in');
    }
    
    const profile = await liff.getProfile();
    return profile;
  } catch (error) {
    console.error('Error getting LIFF profile:', error);
    throw error;
  }
}

// Login with LIFF
export async function loginWithLiff(): Promise<void> {
  try {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  } catch (error) {
    console.error('LIFF login failed:', error);
    throw error;
  }
}

// Logout from LIFF
export async function logoutFromLiff(): Promise<void> {
  try {
    if (liff.isLoggedIn()) {
      liff.logout();
    }
  } catch (error) {
    console.error('LIFF logout failed:', error);
    throw error;
  }
}

// Share content to LINE
export async function shareToLine(text: string, url?: string): Promise<void> {
  try {
    if (!liff.isInClient()) {
      // If not in LINE app, open share dialog
      const shareUrl = url ? `${url}?text=${encodeURIComponent(text)}` : `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
      window.open(shareUrl, '_blank');
      return;
    }

    // If in LINE app, use LIFF share
    await liff.shareTargetPicker([
      {
        type: 'text',
        text: text + (url ? `\n${url}` : ''),
      },
    ]);
  } catch (error) {
    console.error('Share to LINE failed:', error);
    throw error;
  }
}

// Open external browser
export function openExternalBrowser(url: string): void {
  liff.openWindow({
    url: url,
    external: true,
  });
}

// Close LIFF app
export function closeLiffApp(): void {
  liff.closeWindow();
}

// Get LINE version
export function getLineVersion(): string {
  return liff.getVersion();
}

// Check if LIFF is available
export function isLiffAvailable(): boolean {
  return typeof liff !== 'undefined';
}
