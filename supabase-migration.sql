-- Supabase Migration Script สำหรับ readBOOK
-- รันคำสั่งนี้ใน SQL Editor ของ Supabase

-- สร้างตาราง books
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_date DATE,
  isbn VARCHAR(20),
  language VARCHAR(50) DEFAULT 'ไทย',
  pages INTEGER,
  file_size VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง book_links
CREATE TABLE IF NOT EXISTS book_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('google_drive', 'dropbox', 'onedrive', 'mega', 'mediafire', 'direct', 'other')),
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  icon VARCHAR(10) NOT NULL DEFAULT '📚',
  book_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง Indexes เพื่อเพิ่มประสิทธิภาพ
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_book_links_book_id ON book_links(book_id);
CREATE INDEX IF NOT EXISTS idx_book_links_type ON book_links(type);
CREATE INDEX IF NOT EXISTS idx_book_links_is_primary ON book_links(is_primary);

-- สร้าง Full Text Search Index
CREATE INDEX IF NOT EXISTS idx_books_search ON books USING gin(to_tsvector('thai', title || ' ' || author || ' ' || COALESCE(description, '')));

-- สร้างฟังก์ชันอัปเดต updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง Triggers สำหรับอัปเดต updated_at
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_links_updated_at
    BEFORE UPDATE ON book_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- สร้างฟังก์ชันนับจำนวนหนังสือในหมวดหมู่
CREATE OR REPLACE FUNCTION update_category_book_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories 
        SET book_count = book_count + 1 
        WHERE name = NEW.category;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.category != NEW.category THEN
            UPDATE categories 
            SET book_count = book_count - 1 
            WHERE name = OLD.category;
            UPDATE categories 
            SET book_count = book_count + 1 
            WHERE name = NEW.category;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories 
        SET book_count = book_count - 1 
        WHERE name = OLD.category;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- สร้าง Triggers สำหรับนับจำนวนหนังสือ
CREATE TRIGGER update_book_count_on_insert
    AFTER INSERT ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_category_book_count();

CREATE TRIGGER update_book_count_on_update
    AFTER UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_category_book_count();

CREATE TRIGGER update_book_count_on_delete
    AFTER DELETE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_category_book_count();

-- เพิ่มข้อมูลหมวดหมู่เริ่มต้น
INSERT INTO categories (name, description, color, icon) VALUES
('เทคโนโลยี', 'หนังสือเกี่ยวกับเทคโนโลยีและการเขียนโปรแกรม', '#3B82F6', '💻'),
('AI & Data Science', 'ปัญญาประดิษฐ์และวิทยาศาสตร์ข้อมูล', '#10B981', '🤖'),
('การเงิน', 'หนังสือเกี่ยวกับการเงินและการลงทุน', '#F59E0B', '💰'),
('สุขภาพ', 'หนังสือเกี่ยวกับสุขภาพและการดูแลร่างกาย', '#EF4444', '🏥'),
('การศึกษา', 'หนังสือเรียนและตำรา', '#8B5CF6', '📚'),
('ธุรกิจ', 'หนังสือเกี่ยวกับธุรกิจและการจัดการ', '#06B6D4', '💼')
ON CONFLICT (name) DO NOTHING;

-- เพิ่มข้อมูลหนังสือตัวอย่าง
INSERT INTO books (title, author, description, category, tags, language, pages) VALUES
('การเขียนโปรแกรม Python', 'ดร.สมชาย ใจดี', 'หนังสือสอนการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น', 'เทคโนโลยี', ARRAY['Python', 'Programming', 'Beginner'], 'ไทย', 250),
('Machine Learning Fundamentals', 'Dr. Jane Smith', 'A comprehensive guide to machine learning concepts and applications', 'AI & Data Science', ARRAY['Machine Learning', 'AI', 'Data Science'], 'English', 400),
('การลงทุนในหุ้น', 'คุณสมศรี ใจดี', 'คู่มือการลงทุนในตลาดหุ้นสำหรับผู้เริ่มต้น', 'การเงิน', ARRAY['Investment', 'Stock', 'Finance'], 'ไทย', 180);

-- เพิ่มลิงก์ตัวอย่าง
INSERT INTO book_links (book_id, type, url, title, description, is_primary) 
SELECT 
    b.id,
    'google_drive',
    'https://drive.google.com/file/d/example1/view',
    'Google Drive',
    'ไฟล์ PDF คุณภาพสูง',
    true
FROM books b WHERE b.title = 'การเขียนโปรแกรม Python';

INSERT INTO book_links (book_id, type, url, title, description, is_primary) 
SELECT 
    b.id,
    'dropbox',
    'https://dropbox.com/s/example2/file.pdf',
    'Dropbox',
    'สำรอง - ไฟล์เดียวกัน',
    false
FROM books b WHERE b.title = 'การเขียนโปรแกรม Python';

-- ========== SECURITY SETTINGS ==========

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- สร้างตาราง users สำหรับจัดการ Admin
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง admin_sessions สำหรับจัดการ session
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง audit_logs สำหรับติดตามการเปลี่ยนแปลง
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง Indexes สำหรับ Security
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ========== ROW LEVEL SECURITY POLICIES ==========

-- Policies สำหรับ books
CREATE POLICY "Allow public read access to books" ON books 
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to books" ON books 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.is_active = true
    )
  );

-- Policies สำหรับ book_links
CREATE POLICY "Allow public read access to book_links" ON book_links 
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to book_links" ON book_links 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.is_active = true
    )
  );

-- Policies สำหรับ categories
CREATE POLICY "Allow public read access to categories" ON categories 
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to categories" ON categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.is_active = true
    )
  );

-- Policies สำหรับ users (เฉพาะ admin เท่านั้น)
CREATE POLICY "Allow admin access to users" ON users 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin' 
      AND u.is_active = true
    )
  );

-- Policies สำหรับ admin_sessions (เฉพาะ admin เท่านั้น)
CREATE POLICY "Allow admin access to sessions" ON admin_sessions 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.is_active = true
    )
  );

-- Policies สำหรับ audit_logs (เฉพาะ admin เท่านั้น)
CREATE POLICY "Allow admin access to audit_logs" ON audit_logs 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.is_active = true
    )
  );

-- ========== SECURITY FUNCTIONS ==========

-- ฟังก์ชันตรวจสอบ Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin' 
    AND users.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ฟังก์ชันสร้าง Audit Log
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action VARCHAR(50),
  p_table_name VARCHAR(50),
  p_record_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========== AUDIT TRIGGERS ==========

-- Trigger สำหรับ books
CREATE OR REPLACE FUNCTION audit_books_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_audit_log('INSERT', 'books', NEW.id, NULL, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM create_audit_log('UPDATE', 'books', NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM create_audit_log('DELETE', 'books', OLD.id, row_to_json(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_books_trigger
  AFTER INSERT OR UPDATE OR DELETE ON books
  FOR EACH ROW EXECUTE FUNCTION audit_books_changes();

-- Trigger สำหรับ book_links
CREATE OR REPLACE FUNCTION audit_book_links_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_audit_log('INSERT', 'book_links', NEW.id, NULL, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM create_audit_log('UPDATE', 'book_links', NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM create_audit_log('DELETE', 'book_links', OLD.id, row_to_json(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_book_links_trigger
  AFTER INSERT OR UPDATE OR DELETE ON book_links
  FOR EACH ROW EXECUTE FUNCTION audit_book_links_changes();

-- ========== RATE LIMITING ==========

-- สร้างตาราง rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง Index สำหรับ rate limiting
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- ฟังก์ชันตรวจสอบ Rate Limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip_address INET,
  p_endpoint VARCHAR(100),
  p_max_requests INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- ลบข้อมูลเก่า
  DELETE FROM rate_limits 
  WHERE ip_address = p_ip_address 
  AND endpoint = p_endpoint 
  AND window_start < NOW() - INTERVAL '1 hour' * p_window_minutes;
  
  -- นับจำนวน request ปัจจุบัน
  SELECT COALESCE(SUM(request_count), 0) INTO current_count
  FROM rate_limits 
  WHERE ip_address = p_ip_address 
  AND endpoint = p_endpoint 
  AND window_start > NOW() - INTERVAL '1 hour' * p_window_minutes;
  
  -- ตรวจสอบว่าเกิน limit หรือไม่
  IF current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;
  
  -- เพิ่ม request count
  INSERT INTO rate_limits (ip_address, endpoint, request_count)
  VALUES (p_ip_address, p_endpoint, 1)
  ON CONFLICT (ip_address, endpoint) 
  DO UPDATE SET 
    request_count = rate_limits.request_count + 1,
    window_start = NOW();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========== DATA VALIDATION ==========

-- ฟังก์ชันตรวจสอบ URL
CREATE OR REPLACE FUNCTION validate_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN url ~ '^https?://[^\s/$.?#].[^\s]*$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ฟังก์ชันตรวจสอบ Email
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- เพิ่ม Constraints สำหรับ validation
ALTER TABLE book_links 
ADD CONSTRAINT check_valid_url 
CHECK (validate_url(url));

ALTER TABLE users 
ADD CONSTRAINT check_valid_email 
CHECK (validate_email(email));

-- ========== BACKUP AND RECOVERY ==========

-- ฟังก์ชันสร้าง backup
CREATE OR REPLACE FUNCTION create_backup()
RETURNS TEXT AS $$
DECLARE
  backup_name TEXT;
BEGIN
  backup_name := 'backup_' || to_char(NOW(), 'YYYY_MM_DD_HH24_MI_SS');
  
  -- สร้าง backup ของข้อมูลสำคัญ
  PERFORM create_audit_log('BACKUP', 'system', NULL, NULL, json_build_object('backup_name', backup_name));
  
  RETURN backup_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========== SECURITY MONITORING ==========

-- ฟังก์ชันตรวจสอบ suspicious activity
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TABLE (
  ip_address INET,
  request_count BIGINT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.ip_address,
    COUNT(*) as request_count,
    MAX(al.created_at) as last_activity
  FROM audit_logs al
  WHERE al.created_at > NOW() - INTERVAL '1 hour'
  GROUP BY al.ip_address
  HAVING COUNT(*) > 1000  -- มากกว่า 1000 requests ต่อชั่วโมง
  ORDER BY request_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
