-- Supabase seed data for testing Inventory app
-- Run this in Supabase SQL Editor (make sure `uuid-ossp` extension is enabled)

DO $$
DECLARE
  -- Categories
  cat_electronics uuid;
  cat_tech uuid;
  cat_furniture uuid;
  cat_office uuid;
  cat_peripherals uuid;
  
  -- Warehouses
  w_main uuid;
  w_north uuid;
  w_east uuid;
  w_south uuid;
  
  -- Products
  p_monitor uuid;
  p_pc uuid;
  p_ram uuid;
  p_keyboard uuid;
  p_chair uuid;
  p_mouse uuid;
  p_desk uuid;
  p_laptop uuid;
  p_printer uuid;
  p_paper uuid;
  p_pen uuid;
  p_headphones uuid;
  p_webcam uuid;
  p_tablet uuid;
  p_phone uuid;

BEGIN
  -- Categories
  INSERT INTO categories(id, name, description)
  VALUES (uuid_generate_v4(), 'Electronic', 'Electronic devices and accessories')
  RETURNING id INTO cat_electronics;

  INSERT INTO categories(id, name, description)
  VALUES (uuid_generate_v4(), 'Tech', 'Computing and technical equipment')
  RETURNING id INTO cat_tech;

  INSERT INTO categories(id, name, description)
  VALUES (uuid_generate_v4(), 'Furniture', 'Warehouse and office furniture')
  RETURNING id INTO cat_furniture;

  INSERT INTO categories(id, name, description)
  VALUES (uuid_generate_v4(), 'Office Supplies', 'General office consumables and stationery')
  RETURNING id INTO cat_office;

  INSERT INTO categories(id, name, description)
  VALUES (uuid_generate_v4(), 'Peripherals', 'Computer peripherals and add-ons')
  RETURNING id INTO cat_peripherals;

  -- Warehouses
  INSERT INTO warehouses(id, name, location, capacity, current_utilization, status)
  VALUES (uuid_generate_v4(), 'Main Warehouse', 'New York, NY', 100000, 0, 'active')
  RETURNING id INTO w_main;

  INSERT INTO warehouses(id, name, location, capacity, current_utilization, status)
  VALUES (uuid_generate_v4(), 'North Distribution', 'Chicago, IL', 50000, 0, 'active')
  RETURNING id INTO w_north;

  INSERT INTO warehouses(id, name, location, capacity, current_utilization, status)
  VALUES (uuid_generate_v4(), 'East Fulfillment', 'Boston, MA', 30000, 0, 'active')
  RETURNING id INTO w_east;

  INSERT INTO warehouses(id, name, location, capacity, current_utilization, status)
  VALUES (uuid_generate_v4(), 'South Logistics', 'Miami, FL', 45000, 0, 'active')
  RETURNING id INTO w_south;

  -- Products
  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'ELEC-001', 'Monitor', 'Electronic', '27-inch 4K Monitor', 299.99, 50, 'active')
  RETURNING id INTO p_monitor;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'TECH-001', 'PC', 'Tech', 'Desktop Computer', 899.99, 20, 'active')
  RETURNING id INTO p_pc;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'TECH-002', 'RAM', 'Tech', '16GB DDR4 RAM', 79.99, 50, 'active')
  RETURNING id INTO p_ram;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'ELEC-002', 'Keyboard', 'Electronic', 'Mechanical Gaming Keyboard', 79.99, 50, 'active')
  RETURNING id INTO p_keyboard;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'FURN-001', 'Ergonomic Chair', 'Furniture', 'Adjustable ergonomic chair', 199.99, 10, 'active')
  RETURNING id INTO p_chair;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'PERI-001', 'Wireless Mouse', 'Peripherals', 'Ergonomic wireless mouse', 49.99, 30, 'active')
  RETURNING id INTO p_mouse;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'FURN-002', 'Standing Desk', 'Furniture', 'Electric height adjustable desk', 450.00, 5, 'active')
  RETURNING id INTO p_desk;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'TECH-003', 'Laptop Pro', 'Tech', '15-inch High Performance Laptop', 1299.99, 15, 'active')
  RETURNING id INTO p_laptop;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'TECH-004', 'Laser Printer', 'Tech', 'High speed laser printer', 199.99, 10, 'active')
  RETURNING id INTO p_printer;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'OFF-001', 'A4 Paper Ream', 'Office Supplies', '500 sheets A4 paper', 5.99, 100, 'active')
  RETURNING id INTO p_paper;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'OFF-002', 'Ballpoint Pen Box', 'Office Supplies', 'Box of 12 blue pens', 3.99, 50, 'active')
  RETURNING id INTO p_pen;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'ELEC-003', 'Noise Cancelling Headphones', 'Electronic', 'Over-ear wireless headphones', 149.99, 25, 'active')
  RETURNING id INTO p_headphones;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'ELEC-004', 'HD Webcam', 'Electronic', '1080p USB Webcam', 59.99, 20, 'active')
  RETURNING id INTO p_webcam;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'TECH-005', 'Tablet Air', 'Tech', '10-inch Tablet', 399.99, 15, 'active')
  RETURNING id INTO p_tablet;

  INSERT INTO products(id, sku, name, category, description, price, reorder_min, status)
  VALUES (uuid_generate_v4(), 'TECH-006', 'Smartphone X', 'Tech', 'Latest model smartphone', 999.99, 10, 'active')
  RETURNING id INTO p_phone;


  -- Stock by location (distribute across warehouses)
  -- Monitor
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_monitor, 'Main Warehouse', 20, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_monitor, 'North Distribution', 15, w_north, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_monitor, 'East Fulfillment', 10, w_east, now());

  -- PC
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_pc, 'Main Warehouse', 10, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_pc, 'East Fulfillment', 13, w_east, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_pc, 'South Logistics', 5, w_south, now());

  -- RAM
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_ram, 'Main Warehouse', 32, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_ram, 'North Distribution', 50, w_north, now());

  -- Keyboard
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_keyboard, 'Main Warehouse', 100, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_keyboard, 'East Fulfillment', 50, w_east, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_keyboard, 'South Logistics', 25, w_south, now());

  -- Chair
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_chair, 'Main Warehouse', 25, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_chair, 'North Distribution', 10, w_north, now());

  -- Mouse
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_mouse, 'Main Warehouse', 150, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_mouse, 'South Logistics', 75, w_south, now());

  -- Desk
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_desk, 'Main Warehouse', 5, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_desk, 'East Fulfillment', 2, w_east, now());

  -- Laptop
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_laptop, 'Main Warehouse', 40, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_laptop, 'North Distribution', 20, w_north, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_laptop, 'South Logistics', 15, w_south, now());

  -- Printer
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_printer, 'Main Warehouse', 12, w_main, now());

  -- Paper
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_paper, 'Main Warehouse', 500, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_paper, 'North Distribution', 200, w_north, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_paper, 'East Fulfillment', 300, w_east, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_paper, 'South Logistics', 150, w_south, now());

  -- Pen
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_pen, 'Main Warehouse', 1000, w_main, now());

  -- Headphones
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_headphones, 'Main Warehouse', 45, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_headphones, 'East Fulfillment', 20, w_east, now());

  -- Webcam
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_webcam, 'Main Warehouse', 60, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_webcam, 'North Distribution', 30, w_north, now());

  -- Tablet
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_tablet, 'Main Warehouse', 25, w_main, now());
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_tablet, 'South Logistics', 10, w_south, now());

  -- Phone
  INSERT INTO stock_by_location(id, product_id, location, quantity, warehouse_id, last_updated)
  VALUES (uuid_generate_v4(), p_phone, 'Main Warehouse', 15, w_main, now());


  -- Example move history (receipts, deliveries, transfers, adjustments)
  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Receipt', 'Waiting', p_monitor, 10, NULL, 'Main Warehouse', 'Supplier ABC', 'Main Warehouse', 'system', 'Initial stock receipt');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Delivery', 'Done', p_pc, 5, 'Main Warehouse', 'Customer XYZ', 'Main Warehouse', 'Customer XYZ', 'system', 'Shipment to customer');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Transfer', 'Waiting', p_ram, 20, 'Main Warehouse', 'North Distribution', 'Main Warehouse', 'North Distribution', 'system', 'Stock balancing transfer');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Adjustment', 'Done', p_keyboard, 2, 'Main Warehouse', 'Main Warehouse', 'Main Warehouse', 'Main Warehouse', 'system', 'Damage adjustment');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Receipt', 'Done', p_paper, 1000, NULL, 'Main Warehouse', 'Office Depot', 'Main Warehouse', 'system', 'Bulk paper order');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Delivery', 'Waiting', p_laptop, 3, 'Main Warehouse', 'Corporate Client A', 'Main Warehouse', 'Corporate Client A', 'system', 'New employee equipment');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Transfer', 'Done', p_mouse, 50, 'Main Warehouse', 'South Logistics', 'Main Warehouse', 'South Logistics', 'system', 'Restocking South branch');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Adjustment', 'Waiting', p_pen, -5, 'Main Warehouse', 'Main Warehouse', 'Main Warehouse', 'Main Warehouse', 'system', 'Lost inventory found missing');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Receipt', 'Done', p_phone, 20, NULL, 'Main Warehouse', 'Tech Supplier Inc', 'Main Warehouse', 'system', 'New model launch stock');

  INSERT INTO move_history(id, type, status, product_id, quantity, from_location, to_location, source_warehouse, destination_warehouse, created_by, notes)
  VALUES (uuid_generate_v4(), 'Delivery', 'Done', p_desk, 1, 'East Fulfillment', 'Home Office User', 'East Fulfillment', 'Home Office User', 'system', 'Direct delivery');


  -- Update warehouse utilization counts (simple sum of stock quantities per warehouse)
  UPDATE warehouses SET current_utilization = (
    SELECT COALESCE(SUM(quantity),0) FROM stock_by_location WHERE warehouse_id = warehouses.id
  );

END$$;

-- Simple selects for verification
SELECT 'categories' as tbl, count(*) FROM categories;
SELECT 'products' as tbl, count(*) FROM products;
SELECT 'warehouses' as tbl, count(*) FROM warehouses;
SELECT 'stock_by_location' as tbl, count(*) FROM stock_by_location;
SELECT 'move_history' as tbl, count(*) FROM move_history;
