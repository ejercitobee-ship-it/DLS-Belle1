/*
  # Fix Function Search Path Mutable Warning

  ## Problem
  The `update_orders_updated_at` trigger function was created without a fixed
  search_path. A mutable search_path is a security risk — a malicious user
  could manipulate it to redirect function calls to attacker-controlled objects.

  ## Fix
  Recreate the function with `SET search_path = ''` and fully-qualified type
  references to lock down the execution environment.
*/

CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
