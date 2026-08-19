-- Initialize QC database schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  name VARCHAR(200),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_code VARCHAR(100) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspections (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  inspection_type VARCHAR(100) NOT NULL,
  lot_number VARCHAR(100),
  quantity INTEGER DEFAULT 0,
  passed_quantity INTEGER DEFAULT 0,
  failed_quantity INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'PENDING',
  inspector_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ncrs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'OPEN',
  related_inspection_id INTEGER REFERENCES inspections(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  level VARCHAR(50) DEFAULT 'info',
  related_product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  related_inspection_id INTEGER REFERENCES inspections(id) ON DELETE SET NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a default admin user if not exists (username admin / password admin123)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
    INSERT INTO users (username, password, name, role) VALUES ('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8tY1gGQ3vQd0I8gqX6Z0g6y1/5u5e6', 'Administrator', 'admin');
  END IF;
END
$$;

-- Note: The password above is bcrypt for "admin123" pre-hashed. Change in production.
