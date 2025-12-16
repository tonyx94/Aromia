-- Migration: Add latitude and longitude to customer_addresses table

-- Add latitude and longitude columns
ALTER TABLE customer_addresses 
ADD COLUMN latitude DECIMAL(10, 8) NULL,
ADD COLUMN longitude DECIMAL(11, 8) NULL;

-- Add sample coordinates for existing addresses (San José, Costa Rica area)
-- These are example coordinates - you should update them with real addresses
UPDATE customer_addresses 
SET 
    latitude = 9.9281 + (RAND() * 0.1 - 0.05),  -- Random offset around San José
    longitude = -84.0907 + (RAND() * 0.1 - 0.05)
WHERE latitude IS NULL;

-- Example: Set specific coordinates for the first address (if you want to test)
-- UPDATE customer_addresses 
-- SET latitude = 9.9281, longitude = -84.0907 
-- WHERE id = 1;
