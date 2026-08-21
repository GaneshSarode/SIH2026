# Supabase Database & Security Setup

When you are ready to swap from mock data to real database queries, ensure your Supabase project has the correct tables and security policies.

## 1. Tables Schema Reference
Create the following tables in Supabase:
- `households`
  - `id` (text, primary key)
  - `name` (text, optional)
  - `latest_kwh` (numeric)
  - `status` (text: 'online' | 'low')
- `readings`
  - `id` (uuid, primary key)
  - `household_id` (text, foreign key to households)
  - `kw` (numeric)
  - `timestamp` (timestamptz)
- `alerts`
  - `id` (text or uuid, primary key)
  - `household_id` (text, optional)
  - `message` (text)
  - `detail` (text)
  - `severity` (text: 'warning' | 'critical')
  - `created_at` (timestamptz)
  - `acknowledged` (boolean, default false)

## 2. Row Level Security (RLS) Policies
You MUST apply Row Level Security to prevent unauthorized modifications to your database from the public website. Run the following in the Supabase SQL Editor:

```sql
-- Enable RLS on all tables
alter table households enable row level security;
alter table readings enable row level security;
alter table alerts enable row level security;

-- Public read access for households and readings
create policy "Public read households" on households for select using (true);
create policy "Public read readings" on readings for select using (true);

-- Alerts can be read by anyone, but only updated by authenticated operators
create policy "Public read alerts" on alerts for select using (true);
create policy "Operators can update alerts" on alerts for update using (auth.role() = 'authenticated');
```

## 3. Hardware Data Ingestion (ESP32)
Your ESP32 data ingestion script should use the **Supabase Service Role Key** to insert data into the `readings` table. The Service Role key bypasses RLS rules, which is necessary since the public frontend only has `SELECT` permission.
**Never put the Service Role key in your `.env.local` or frontend code.** Use only the `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the frontend.
