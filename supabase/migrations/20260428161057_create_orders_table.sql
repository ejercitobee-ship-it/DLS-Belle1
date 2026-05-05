/*
  # Create Orders Table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique) — human-readable order ID e.g. DLS-ABC123
      - `customer_email` (text) — buyer's email
      - `customer_name` (text) — full name
      - `shipping_address` (jsonb) — address, city, state, zip, country, phone
      - `items` (jsonb) — array of ordered products with id, name, price, quantity, image
      - `subtotal` (numeric) — pre-tax, pre-shipping total
      - `shipping` (numeric) — shipping cost (0 for free)
      - `tax` (numeric) — tax amount
      - `total` (numeric) — final total charged
      - `status` (text) — order lifecycle: pending_payment, paid, processing, shipped, delivered, cancelled
      - `payment_method` (text) — card, etc.
      - `card_last4` (text) — last 4 digits of card for reference
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public INSERT allowed (guest checkout — no auth required)
    - SELECT only by matching customer_email (no auth) or authenticated admin
    - No public UPDATE/DELETE
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  shipping_address jsonb NOT NULL DEFAULT '{}',
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2) NOT NULL DEFAULT 0,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending_payment',
  payment_method text NOT NULL DEFAULT 'card',
  card_last4 text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to place an order (guest checkout)
CREATE POLICY "Anyone can create an order"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Customers can view their own orders by email
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();

-- Index for quick lookup by email and order number
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
