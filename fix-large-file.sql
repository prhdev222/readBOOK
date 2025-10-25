-- แก้ไขปัญหาไฟล์ใหญ่เกินกว่าจะแสดงตัวอย่าง
-- ใช้ direct download link แทน preview

-- อัปเดต Google Drive link ให้ใช้ direct download format
UPDATE book_links 
SET url = 'https://drive.google.com/uc?export=download&id=1WoMCiHj7FNWQ5x2wy7LRm6PnavrLOei5',
    title = 'Google Drive - Download (ไฟล์ใหญ่)',
    type = 'direct'
WHERE url LIKE '%1WoMCiHj7FNWQ5x2wy7LRm6PnavrLOei5%';

-- เพิ่มลิงก์สำรองที่ใช้ PDF viewer ออนไลน์
INSERT INTO book_links (book_id, type, url, title, is_primary, is_active) 
SELECT 
    b.id,
    'direct',
    'https://mozilla.github.io/pdf.js/web/viewer.html?file=https://drive.google.com/uc?export=download&id=1WoMCiHj7FNWQ5x2wy7LRm6PnavrLOei5',
    'PDF.js Viewer (แนะนำ)',
    true,
    true
FROM books b WHERE b.title = 'Care for Sick Monks'
ON CONFLICT DO NOTHING;

-- เพิ่มลิงก์สำรองที่ใช้ Google Docs Viewer
INSERT INTO book_links (book_id, type, url, title, is_primary, is_active) 
SELECT 
    b.id,
    'direct',
    'https://docs.google.com/gview?url=https://drive.google.com/uc?export=download&id=1WoMCiHj7FNWQ5x2wy7LRm6PnavrLOei5&embedded=true',
    'Google Docs Viewer',
    false,
    true
FROM books b WHERE b.title = 'Care for Sick Monks'
ON CONFLICT DO NOTHING;
