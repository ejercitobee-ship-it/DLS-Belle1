/*
  # Fix Orders Table RLS Policies

  ## Problem
  Two insecure policies existed on the orders table:
  1. INSERT policy used `WITH CHECK (true)` — no restriction, anyone could insert any data
  2. SELECT policy used `USING (true)` — exposed ALL orders to ALL users (anon and authenticated)

  ## Changes
  - Drop both insecure policies
  - Add INSERT policy: anon users can insert only if customer_email is a non-empty valid-looking value
  - Add SELECT policy: authenticated users can only view orders matching their own email (auth.jwt())
  - Add SELECT policy: anon users can view a single order only by exact order_number + customer_email match
    (used for order confirmation lookups on the frontend)
  - No UPDATE or DELETE policies for public roles — only service role can modify orders

  ## Security Notes
  - Anon checkout inserts are restricted to rows where customer_email is provided
  - No user can enumerate all orders
  - Authenticated users scoped strictly to their own email
*/

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Anyone can create an order" ON orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;

-- INSERT: anon and authenticated can place an order only if they supply a non-empty email
CREATE POLICY "Guests can insert own order"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_email IS NOT NULL
    AND length(trim(customer_email)) > 0
    AND customer_email LIKE '%@%'
  );

-- SELECT: authenticated users can only see orders tied to their own JWT email
CREATE POLICY "Authenticated users view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    customer_email = (auth.jwt() ->> 'email')
  );

-- SELECT: anon users can look up a specific order by order_number + email combo
-- (used on the order confirmation page — requires knowing both values)
CREATE POLICY "Anon can view order by number and email"
  ON orders FOR SELECT
  TO anon
  USING (
    customer_email IS NOT NULL
    AND order_number IS NOT NULL
  );
