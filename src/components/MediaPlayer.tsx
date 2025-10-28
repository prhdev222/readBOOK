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
  const [showImageModal, setShowImageModal] = useState(false);

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
        return (
          <>
            <div className="relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
              <img
                src={media.url}
                alt={media.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  คลิกดูรูปภาพขนาดใหญ่
                </span>
              </div>
            </div>
            
            {/* Image Modal */}
            {showImageModal && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={() => setShowImageModal(false)}
              >
                <div className="max-w-7xl max-h-screen">
                  <img
                    src={media.url}
                    alt={media.title}
                    className="max-w-full max-h-screen object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </>
        );

      case 'audio':
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{formatTime(0)}</span>
                  <span>{formatTime(media.duration || 0)}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
            </div>
            <audio
              src={media.url}
              controls
              className="w-full mt-2"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        );

      case 'video':
        return (
          <div className="relative">
            <video
              src={media.url}
              controls
              className="w-full h-64 object-cover rounded-lg"
              poster={media.thumbnail_url}
            />
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
        return (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">{getMediaIcon()}</div>
            <p className="text-gray-600 mb-4">{media.title}</p>
            <a
              href={media.url}
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