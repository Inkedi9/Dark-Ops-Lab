-- Atomic XP increment for the profiles table.
--
-- Replaces any read-modify-write pattern from the client with a single
-- UPDATE that PostgreSQL serialises via row-level locking.  Concurrent
-- calls block on the first UPDATE and correctly stack their increments.
--
-- Level / rank formula mirrors localProfileAdapter.ts (packages/profile):
--   level = floor(xp / 100) + 1
--   rank  = ROOKIE < 10 | HUNTER < 25 | OPERATOR < 50 | GHOST 50+
--
-- Called by dark-api after a validated progress event is inserted.
-- SECURITY DEFINER + explicit search_path prevents search-path injection.
-- Only service_role may execute this function.

CREATE OR REPLACE FUNCTION add_xp(p_user_id uuid, p_amount int)
RETURNS TABLE(xp int, level int, rank text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_xp    int;
    v_level int;
    v_rank  text;
BEGIN
    IF p_amount <= 0 THEN
        RETURN;
    END IF;

    -- Atomically increment XP.  PostgreSQL row lock serialises concurrent calls.
    UPDATE profiles
    SET    xp         = profiles.xp + p_amount,
           updated_at = now()
    WHERE  id = p_user_id
    RETURNING profiles.xp INTO v_xp;

    IF NOT FOUND THEN
        RETURN;  -- profile does not exist yet; caller should handle this
    END IF;

    v_level := floor(v_xp::numeric / 100)::int + 1;

    v_rank := CASE
                  WHEN v_level >= 50 THEN 'GHOST'
                  WHEN v_level >= 25 THEN 'OPERATOR'
                  WHEN v_level >= 10 THEN 'HUNTER'
                  ELSE 'ROOKIE'
              END;

    UPDATE profiles
    SET    level = v_level,
           rank  = v_rank
    WHERE  id = p_user_id;

    RETURN QUERY SELECT v_xp, v_level, v_rank;
END;
$$;

-- Restrict to service_role only — never expose to anon or authenticated roles.
REVOKE ALL ON FUNCTION add_xp(uuid, int) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION add_xp(uuid, int) TO service_role;
