-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id uuid default uuid_generate_v4() primary key,
  sku text not null unique,
  name text not null,
  category text not null,
  description text,
  price numeric not null,
  reorder_min integer default 0,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Warehouses Table
create table warehouses (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text not null,
  capacity integer,
  current_utilization integer default 0,
  status text default 'active',
  created_at timestamptz default now()
);

-- Stock By Location Table
create table stock_by_location (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  location text not null,
  quantity integer default 0,
  last_updated timestamptz default now(),
  warehouse_id uuid references warehouses(id)
);

-- Move History Table
create table move_history (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- Receipt, Delivery, Transfer, Adjustment
  status text not null, -- Draft, Waiting, Ready, Done, Canceled
  product_id uuid references products(id),
  quantity integer not null,
  from_location text,
  to_location text,
  source_warehouse text,
  destination_warehouse text,
  created_by text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories Table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table warehouses enable row level security;
alter table stock_by_location enable row level security;
alter table move_history enable row level security;
alter table categories enable row level security;

-- Create policies (allow public access for demo purposes)
create policy "Public products access" on products for all using (true);
create policy "Public warehouses access" on warehouses for all using (true);
create policy "Public stock access" on stock_by_location for all using (true);
create policy "Public move_history access" on move_history for all using (true);
create policy "Public categories access" on categories for all using (true);

-- Enable Realtime
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table move_history;
alter publication supabase_realtime add table stock_by_location;
