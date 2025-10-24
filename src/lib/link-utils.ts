import { BookLink } from '@/types';

// ฟังก์ชันตรวจสอบประเภทของลิงก์
export function detectLinkType(url: string): BookLink['type'] {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('drive.google.com') || urlLower.includes('docs.google.com')) {
    return 'google_drive';
  }
  if (urlLower.includes('dropbox.com')) {
    return 'dropbox';
  }
  if (urlLower.includes('1drv.ms') || urlLower.includes('onedrive.live.com')) {
    return 'onedrive';
  }
  if (urlLower.includes('mega.nz')) {
    return 'mega';
  }
  if (urlLower.includes('mediafire.com')) {
    return 'mediafire';
  }
  if (urlLower.includes('http://') || urlLower.includes('https://')) {
    return 'direct';
  }
  
  return 'other';
}

// ฟังก์ชันสร้างลิงก์ใหม่
export function createBookLink(
  url: string, 
  title: string, 
  description?: string, 
  isPrimary: boolean = false
): BookLink {
  return {
    id: generateId(),
    type: detectLinkType(url),
    url,
    title,
    description,
    isPrimary,
    isActive: true
  };
}

// ฟังก์ชันสร้าง ID แบบง่าย
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// ฟังก์ชันตรวจสอบความถูกต้องของลิงก์
export function validateLink(url: string): { isValid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);
    
    // ตรวจสอบ protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL ต้องเป็น http หรือ https เท่านั้น' };
    }
    
    // ตรวจสอบ domain
    const allowedDomains = [
      'drive.google.com',
      'docs.google.com',
      'dropbox.com',
      '1drv.ms',
      'onedrive.live.com',
      'mega.nz',
      'mediafire.com'
    ];
    
    const isAllowedDomain = allowedDomains.some(domain => 
      urlObj.hostname.includes(domain)
    );
    
    if (!isAllowedDomain) {
      return { isValid: false, error: 'ไม่รองรับ domain นี้' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'URL ไม่ถูกต้อง' };
  }
}

// ฟังก์ชันดึงข้อมูลจากลิงก์
export function getLinkInfo(url: string): {
  type: BookLink['type'];
  domain: string;
  filename?: string;
} {
  const urlObj = new URL(url);
  const type = detectLinkType(url);
  
  // ดึงชื่อไฟล์จาก URL
  const pathname = urlObj.pathname;
  const filename = pathname.split('/').pop();
  
  return {
    type,
    domain: urlObj.hostname,
    filename: filename || undefined
  };
}

// ฟังก์ชันจัดรูปแบบลิงก์สำหรับแสดงผล
export function formatLinkForDisplay(link: BookLink): {
  displayUrl: string;
  icon: string;
  color: string;
} {
  const icons = {
    google_drive: '📁',
    dropbox: '📦',
    onedrive: '☁️',
    mega: '🔒',
    mediafire: '🔥',
    direct: '🔗',
    other: '📄'
  };
  
  const colors = {
    google_drive: 'text-blue-600',
    dropbox: 'text-blue-500',
    onedrive: 'text-blue-700',
    mega: 'text-red-600',
    mediafire: 'text-orange-600',
    direct: 'text-gray-600',
    other: 'text-gray-500'
  };
  
  // ย่อ URL สำหรับแสดงผล
  const displayUrl = link.url.length > 50 
    ? link.url.substring(0, 50) + '...' 
    : link.url;
  
  return {
    displayUrl,
    icon: icons[link.type],
    color: colors[link.type]
  };
}

// ฟังก์ชันตรวจสอบว่าลิงก์ใช้งานได้หรือไม่
export async function checkLinkAvailability(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // หลีกเลี่ยง CORS issues
    });
    return true;
  } catch (error) {
    return false;
  }
}
