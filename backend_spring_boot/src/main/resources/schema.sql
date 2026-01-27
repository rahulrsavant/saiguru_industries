CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

CREATE TABLE IF NOT EXISTS seeded_products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_type VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  calculator_id VARCHAR(120) NOT NULL,
  metal_id VARCHAR(100) NOT NULL,
  alloy_id VARCHAR(100) NOT NULL,
  dimensions_json CLOB NOT NULL,
  price_per_kg DECIMAL(10, 2),
  created_by VARCHAR(120) NOT NULL,
  is_seeded BOOLEAN NOT NULL DEFAULT TRUE,
  seed_batch_id VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seeded_products_seeded ON seeded_products (is_seeded);
CREATE INDEX IF NOT EXISTS idx_seeded_products_lookup ON seeded_products (is_seeded, product_type, display_name);
CREATE INDEX IF NOT EXISTS idx_seeded_products_batch ON seeded_products (seed_batch_id);

CREATE TABLE IF NOT EXISTS estimates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  estimate_no VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  mobile VARCHAR(40) NOT NULL,
  email VARCHAR(255),
  created_by VARCHAR(255),
  is_seeded_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_estimates_seeded ON estimates (is_seeded_demo);
CREATE INDEX IF NOT EXISTS idx_estimates_created_by ON estimates (created_by);

CREATE TABLE IF NOT EXISTS estimate_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  estimate_id BIGINT NOT NULL,
  product_type VARCHAR(100) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  shape_calculator_id VARCHAR(120) NOT NULL,
  metal_id VARCHAR(100) NOT NULL,
  alloy_id VARCHAR(100) NOT NULL,
  pieces INT NOT NULL,
  mode VARCHAR(40) NOT NULL,
  unit_system VARCHAR(20) NOT NULL,
  dimensions_json CLOB NOT NULL,
  result_kg DECIMAL(12, 3) NOT NULL,
  product_ref_id BIGINT,
  is_seeded_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_estimate_items_estimate FOREIGN KEY (estimate_id) REFERENCES estimates(id)
);

CREATE INDEX IF NOT EXISTS idx_estimate_items_seeded ON estimate_items (is_seeded_demo);
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate ON estimate_items (estimate_id);
CREATE INDEX IF NOT EXISTS idx_estimate_items_ref ON estimate_items (estimate_id, product_ref_id);
