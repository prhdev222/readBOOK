-- Migration script to add media support to digital library
-- This script adds new media types and updates existing tables

-- 1. Add new media types to book_links table
ALTER TABLE book_links 
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'file';

-- 2. Update existing book_links to have media_type = 'file'
UPDATE book_links 
SET media_type = 'file' 
WHERE media_type IS NULL;

-- 3. Add new columns for media metadata
ALTER TABLE book_links 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS duration INTEGER, -- for audio/video in seconds
ADD COLUMN IF NOT EXISTS file_size BIGINT, -- file size in bytes
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Create new table for media collections (optional grouping)
CREATE TABLE IF NOT EXISTS media_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add collection reference to book_links
ALTER TABLE book_links 
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES media_collections(id) ON DELETE SET NULL;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_book_links_media_type ON book_links(media_type);
CREATE INDEX IF NOT EXISTS idx_book_links_collection_id ON book_links(collection_id);
CREATE INDEX IF NOT EXISTS idx_media_collections_book_id ON media_collections(book_id);

-- 7. Add constraints for media_type
ALTER TABLE book_links 
ADD CONSTRAINT check_media_type 
CHECK (media_type IN ('file', 'image', 'audio', 'video', 'youtube', 'document'));

-- 8. Update the type column to include new media types
-- First, let's see what types we currently have
-- We'll need to update the existing type constraint

-- Drop existing constraint if it exists
ALTER TABLE book_links DROP CONSTRAINT IF EXISTS book_links_type_check;

-- Add new constraint with expanded types
ALTER TABLE book_links 
ADD CONSTRAINT book_links_type_check 
CHECK (type IN (
  'google_drive', 'dropbox', 'onedrive', 'mega', 'mediafire', 'direct', 'other',
  'youtube', 'vimeo', 'soundcloud', 'spotify', 'image', 'audio', 'video'
));

-- 9. Create a view for easy media browsing
CREATE OR REPLACE VIEW media_view AS
SELECT 
  bl.id,
  bl.book_id,
  b.title as book_title,
  b.author,
  b.category,
  bl.type,
  bl.media_type,
  bl.url,
  bl.title,
  bl.description,
  bl.thumbnail_url,
  bl.duration,
  bl.file_size,
  bl.mime_type,
  bl.is_primary,
  bl.is_active,
  bl.collection_id,
  mc.name as collection_name,
  bl.created_at,
  bl.updated_at
FROM book_links bl
JOIN books b ON bl.book_id = b.id
LEFT JOIN media_collections mc ON bl.collection_id = mc.id
WHERE bl.is_active = true;

-- 10. Add RLS policies for media_collections
ALTER TABLE media_collections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to media collections
CREATE POLICY "Allow public read access to media collections" ON media_collections
  FOR SELECT USING (true);

-- Allow authenticated users to insert media collections
CREATE POLICY "Allow authenticated users to insert media collections" ON media_collections
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update media collections
CREATE POLICY "Allow authenticated users to update media collections" ON media_collections
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete media collections
CREATE POLICY "Allow authenticated users to delete media collections" ON media_collections
  FOR DELETE USING (auth.role() = 'authenticated');

-- 11. Add comments for documentation
COMMENT ON COLUMN book_links.description IS 'Description of the media item';
COMMENT ON COLUMN book_links.media_type IS 'Type of media: file, image, audio, video, youtube, document';
COMMENT ON COLUMN book_links.thumbnail_url IS 'URL for thumbnail/preview image';
COMMENT ON COLUMN book_links.duration IS 'Duration in seconds for audio/video content';
COMMENT ON COLUMN book_links.file_size IS 'File size in bytes';
COMMENT ON COLUMN book_links.mime_type IS 'MIME type of the media file';
COMMENT ON COLUMN book_links.updated_at IS 'Last updated timestamp';
COMMENT ON COLUMN book_links.collection_id IS 'Reference to media collection for grouping';

COMMENT ON TABLE media_collections IS 'Collections to group related media items';
COMMENT ON VIEW media_view IS 'Unified view of all media with book information';
