'use client';

import { BookLink } from '@/lib/supabase';

interface MediaPlayerFallbackProps {
  media: BookLink;
  className?: string;
}

export default function MediaPlayerFallback({ media, className = '' }: MediaPlayerFallbackProps) {
  if (!media) {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="p-4 text-center text-gray-500">
          ไม่พบข้อมูลสื่อ
        </div>
      </div>
    );
  }

  const getMediaIcon = () => {
    switch (media.media_type || 'file') {
      case 'image':
        return '🖼️';
      case 'audio':
        return '🎵';
      case 'video':
        return '🎬';
      case 'youtube':
        return '📺';
      case 'document':
        return '📄';
      default:
        return '📁';
    }
  };

  const getTypeLabel = () => {
    switch (media.type) {
      case 'youtube':
        return 'YouTube';
      case 'vimeo':
        return 'Vimeo';
      case 'soundcloud':
        return 'SoundCloud';
      case 'spotify':
        return 'Spotify';
      case 'image':
        return 'รูปภาพ';
      case 'audio':
        return 'เสียง';
      case 'video':
        return 'วิดีโอ';
      case 'google_drive':
        return 'Google Drive';
      case 'dropbox':
        return 'Dropbox';
      case 'onedrive':
        return 'OneDrive';
      case 'mega':
        return 'MEGA';
      case 'mediafire':
        return 'MediaFire';
      case 'direct':
        return 'ดาวน์โหลด';
      default:
        return 'ไฟล์';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Media Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMediaIcon()}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{media.title || 'ไม่มีชื่อ'}</h3>
              <p className="text-sm text-gray-600">{getTypeLabel()}</p>
            </div>
          </div>
          {media.is_primary && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              หลัก
            </span>
          )}
        </div>
        {media.description && (
          <p className="text-sm text-gray-600 mt-2">{media.description}</p>
        )}
      </div>

      {/* Media Content */}
      <div className="p-4">
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">{getMediaIcon()}</div>
          <p className="text-gray-600 mb-4">{media.title || 'ไม่มีชื่อ'}</p>
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เปิด/ดาวน์โหลด
          </a>
        </div>
      </div>
    </div>
  );
}
