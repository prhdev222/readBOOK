'use client';

import { useState } from 'react';
import { BookLink } from '@/lib/supabase';

// Extended interface to handle undefined properties
interface MediaPlayerBookLink extends Omit<BookLink, 'media_type' | 'updated_at'> {
  media_type?: 'file' | 'image' | 'audio' | 'video' | 'youtube' | 'document';
  updated_at?: string;
}

interface MediaPlayerProps {
  media: MediaPlayerBookLink;
  className?: string;
}

export default function MediaPlayer({ media, className = '' }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageUrlState, setImageUrlState] = useState<Map<string, string>>(new Map());
  const [volume, setVolume] = useState(75); // เพิ่ม state สำหรับ volume

  // Guard clause to prevent runtime errors
  if (!media) {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="p-4 text-center text-gray-500">
          ไม่พบข้อมูลสื่อ
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ฟังก์ชันจัดการ volume
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // ปรับ volume ของ iframe (Google Drive player)
    const iframe = document.querySelector('iframe[title*="Audio player"]') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        // ส่ง message ไปยัง iframe เพื่อปรับ volume
        iframe.contentWindow.postMessage({
          type: 'setVolume',
          volume: newVolume / 100
        }, '*');
      } catch (error) {
        console.log('Cannot control iframe volume:', error);
      }
    }
  };

  // Convert Google Drive URL to direct download URL
  const convertDriveUrl = (url: string, mediaType?: string) => {
    // Check if it's a Google Drive URL
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      
      // Different conversion based on media type
      if (mediaType === 'audio' || mediaType === 'video') {
        // For audio/video files, use direct download
        const convertedUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log('Converting Drive URL for media:', url, '→', convertedUrl);
        return convertedUrl;
      } else if (mediaType === 'image') {
        // For images, use view URL
        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log('Converting Drive URL for image:', url, '→', convertedUrl);
        return convertedUrl;
      } else {
        // For other files, use download URL
        const convertedUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        console.log('Converting Drive URL for file:', url, '→', convertedUrl);
        return convertedUrl;
      }
    }
    console.log('Using original URL:', url);
    return url;
  };


  // Get alternative URL if first one fails
  const getAlternativeUrl = (url: string) => {
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    return url;
  };

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

  const renderMediaContent = () => {
    switch (media.media_type || 'file') {
      case 'image':
        const initialImageUrl = convertDriveUrl(media.url, 'image');
        const currentImageUrl = imageUrlState.get(media.id) || initialImageUrl;
        
        return (
          <div className="relative group bg-gray-100 rounded-lg">
            <img
              src={currentImageUrl}
              alt={media.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                if (currentImageUrl === initialImageUrl) {
                  console.error('Image load error, trying alternative:', currentImageUrl);
                  const altUrl = getAlternativeUrl(media.url);
                  setImageUrlState(new Map(imageUrlState).set(media.id, altUrl));
                  console.log('Trying alternative URL:', altUrl);
                }
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200 pointer-events-auto">
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  ดูรูปภาพ
                </a>
              </div>
            </div>
          </div>
        );

      case 'audio':
        // แปลง Drive URL เป็น proxy API
        const idMatch = media.url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        const proxyUrl = idMatch ? `/api/proxy/google-drive?id=${idMatch[1]}` : media.url;

        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🎵</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">{media.title}</h4>
                  <p className="text-blue-100 text-sm">เสียง</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <audio
                src={proxyUrl}
                controls
                className="w-full"
                onError={(e) => {
                  console.error('Audio load error:', e);
                  // ถ้า proxy ล้มเหลว ให้ลองใช้ Google Drive preview
                  if (idMatch) {
                    const previewUrl = `https://drive.google.com/file/d/${idMatch[1]}/preview`;
                    const audioElement = e.target as HTMLAudioElement;
                    audioElement.src = previewUrl;
                  }
                }}
              />
              
              {/* Fallback message */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 mb-2">
                  หากไม่สามารถเล่นได้ กรุณาตรวจสอบสิทธิ์ไฟล์ใน Google Drive
                </p>
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  เปิดใน Google Drive
                </a>
              </div>

              {/* Additional info */}
              {(media.duration || media.file_size) && (
                <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  {media.duration && (
                    <span className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{formatTime(media.duration)}</span>
                    </span>
                  )}
                  {media.file_size && (
                    <span className="flex items-center space-x-1">
                      <span>📦</span>
                      <span>{formatFileSize(media.file_size)}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'video':
        const videoUrl = convertDriveUrl(media.url, 'video');
        return (
          <div className="relative">
            <video
              src={videoUrl}
              controls
              className="w-full h-64 object-cover rounded-lg"
              poster={media.thumbnail_url}
              onError={(e) => {
                console.error('Video load error:', e);
                // Try alternative URL if available
                const altUrl = getAlternativeUrl(media.url);
                if (altUrl !== media.url) {
                  console.log('Trying alternative URL:', altUrl);
                  const videoElement = e.target as HTMLVideoElement;
                  videoElement.src = altUrl;
                }
              }}
            />
            {/* Fallback download link */}
            <div className="mt-2 text-center">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                ดาวน์โหลดไฟล์วิดีโอ
              </a>
            </div>
          </div>
        );

      case 'youtube':
        const getYouTubeEmbedUrl = (url: string) => {
          const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
          return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
        };

        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={getYouTubeEmbedUrl(media.url)}
              title={media.title}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      default:
        const fileUrl = convertDriveUrl(media.url, 'file');
        return (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">{getMediaIcon()}</div>
            <p className="text-gray-600 mb-4">{media.title}</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              เปิด/ดาวน์โหลด
            </a>
          </div>
        );
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
              <h3 className="font-semibold text-gray-900">{media.title}</h3>
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
        {(media.duration || media.file_size) && (
          <div className="flex space-x-4 mt-2 text-xs text-gray-500">
            {media.duration && (
              <span>⏱️ {formatTime(media.duration)}</span>
            )}
            {media.file_size && (
              <span>📦 {formatFileSize(media.file_size)}</span>
            )}
          </div>
        )}
      </div>

      {/* Media Content */}
      <div className="p-4">
        {renderMediaContent()}
      </div>
    </div>
  );
}