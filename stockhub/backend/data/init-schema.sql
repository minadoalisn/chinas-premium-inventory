-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "phone" varchar NOT NULL,
  "password" varchar,
  "role" varchar NOT NULL DEFAULT ('buyer'),
  "nickname" varchar,
  "avatar" varchar,
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")
);

-- Merchants table
CREATE TABLE IF NOT EXISTS "merchants" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" integer NOT NULL,
  "company_name" varchar(200) NOT NULL,
  "business_license" varchar(50) NOT NULL,
  "contact_person" varchar(100) NOT NULL,
  "phone" varchar(50) NOT NULL,
  "address" varchar(500),
  "city" varchar(100),
  "province" varchar(100),
  "country" varchar(100) NOT NULL DEFAULT ('China'),
  "postal_code" varchar(20),
  "factory_area" decimal(10,2),
  "employee_count" integer,
  "production_lines" integer,
  "annual_revenue" decimal(15,2),
  "certifications" json,
  "product_images" json,
  "status" varchar(20) NOT NULL DEFAULT ('pending'),
  "rating" decimal(2,1) NOT NULL DEFAULT (5),
  "completed_orders" integer NOT NULL DEFAULT (0),
  "total_reviews" integer NOT NULL DEFAULT (0),
  "response_rate" decimal(5,2) NOT NULL DEFAULT (0),
  "response_time" varchar(20) NOT NULL DEFAULT ('24h'),
  "bank_name" varchar(200),
  "bank_account" varchar(100),
  "swift_code" varchar(20),
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
  "approved_at" datetime,
  CONSTRAINT "UQ_31c2da633a6fac3b71cca753b8f" UNIQUE ("business_license"),
  CONSTRAINT "REL_698f612a3134c503f711479a4e" UNIQUE ("user_id")
);

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" varchar NOT NULL,
  "name_en" varchar,
  "slug" varchar NOT NULL,
  "description" text,
  "parent_id" integer,
  "level" integer NOT NULL DEFAULT (1),
  "sort_order" integer NOT NULL DEFAULT (0),
  "is_active" boolean NOT NULL DEFAULT (1),
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"),
  CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug")
);

-- Demands table
CREATE TABLE IF NOT EXISTS "demands" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "buyer_id" integer NOT NULL,
  "category_id" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "min_qty" integer NOT NULL,
  "max_price" decimal(10,2) NOT NULL,
  "demand_desc" text,
  "location" varchar(100),
  "status" varchar(20) NOT NULL DEFAULT ('open'),
  "matched_count" integer NOT NULL DEFAULT (0),
  "tags" json,
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
);

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "merchant_id" integer NOT NULL,
  "category_id" integer NOT NULL,
  "title" varchar(255) NOT NULL,
  "title_en" varchar(255),
  "description" text,
  "description_en" text,
  "slug" varchar(300) NOT NULL,
  "specifications" json,
  "images" json NOT NULL,
  "stock_qty" integer NOT NULL DEFAULT (0),
  "min_order_qty" integer NOT NULL DEFAULT (1),
  "display_domestic" boolean NOT NULL DEFAULT (1),
  "display_overseas" boolean NOT NULL DEFAULT (1),
  "expire_date" date,
  "status" varchar(20) NOT NULL DEFAULT ('pending'),
  "synced_at" datetime,
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
  "videos" json,
  "sku" varchar(100),
  "brand" varchar(100),
  "domestic_price" decimal(10,2) NOT NULL,
  "overseas_price" decimal(10,2) NOT NULL,
  "wholesale_tiers" json,
  "is_expired" boolean NOT NULL DEFAULT (0),
  "seo_title" varchar(255),
  "seo_description" text,
  "seo_keywords" varchar(500),
  "view_count" integer NOT NULL DEFAULT (0),
  "inquiry_count" integer NOT NULL DEFAULT (0),
  "sold_count" integer NOT NULL DEFAULT (0),
  CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug")
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS "inquiries" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "buyer_id" integer NOT NULL,
  "buyer_company_name" varchar(200) NOT NULL,
  "buyer_name" varchar(100) NOT NULL,
  "buyer_email" varchar(100) NOT NULL,
  "buyer_phone" varchar(50),
  "product_ids" json NOT NULL,
  "product_details" json,
  "message" text,
  "status" varchar(20) NOT NULL DEFAULT ('pending'),
  "buyer_viewed_at" datetime,
  "merchant_reply" text,
  "merchant_viewed_at" datetime,
  "last_activity_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
);

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "order_no" varchar(32) NOT NULL,
  "buyer_id" bigint NOT NULL,
  "merchant_id" bigint NOT NULL,
  "product_id" bigint NOT NULL,
  "quantity" integer NOT NULL DEFAULT (1),
  "unit_price" decimal(10,2) NOT NULL,
  "total_amount" decimal(12,2) NOT NULL,
  "currency" varchar(10) NOT NULL DEFAULT ('CNY'),
  "deposit_amount" decimal(10,2) NOT NULL DEFAULT (0),
  "deposit_paid_at" datetime,
  "balance_paid_at" datetime,
  "shipping_method" varchar(50),
  "tracking_number" varchar(100),
  "carrier" varchar(100),
  "shipping_address" text,
  "shipping_cost" decimal(10,2) NOT NULL DEFAULT (0),
  "status" varchar(20) NOT NULL DEFAULT ('pending_deposit'),
  "order_notes" text,
  "created_by" varchar(20) NOT NULL,
  "updated_by" varchar(20) NOT NULL,
  "created_at" datetime NOT NULL DEFAULT (datetime('now')),
  "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
  "paymentStatus" varchar(20) NOT NULL DEFAULT ('pending_deposit'),
  CONSTRAINT "UQ_035026a83bef9740d7ad05df383" UNIQUE ("order_no")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_status_merchants" ON "merchants" ("status");
CREATE INDEX IF NOT EXISTS "idx_buyer_demands" ON "demands" ("buyer_id");
CREATE INDEX IF NOT EXISTS "idx_status_demands" ON "demands" ("status");
CREATE INDEX IF NOT EXISTS "idx_category_demands" ON "demands" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_merchant_products" ON "products" ("merchant_id");
CREATE INDEX IF NOT EXISTS "idx_status_products" ON "products" ("status");
CREATE INDEX IF NOT EXISTS "idx_buyer_inquiries" ON "inquiries" ("buyer_id");
CREATE INDEX IF NOT EXISTS "idx_status_inquiries" ON "inquiries" ("status");
CREATE INDEX IF NOT EXISTS "idx_buyer_orders" ON "orders" ("buyer_id");
CREATE INDEX IF NOT EXISTS "idx_merchant_orders" ON "orders" ("merchant_id");
CREATE INDEX IF NOT EXISTS "idx_status_orders" ON "orders" ("status");
CREATE INDEX IF NOT EXISTS "idx_order_no" ON "orders" ("order_no");
