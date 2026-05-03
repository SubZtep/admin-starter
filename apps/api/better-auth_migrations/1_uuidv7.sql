CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION uuidv7()
RETURNS uuid
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  ts bytea;
  rnd bytea;
BEGIN
  ts := substring(
    int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint)
    FROM 3
  );

  rnd := gen_random_bytes(10);

  -- UUIDv7 version bits
  rnd := set_byte(rnd, 0, (get_byte(rnd, 0) & 15) | 112);

  -- UUID variant bits
  rnd := set_byte(rnd, 2, (get_byte(rnd, 2) & 63) | 128);

  RETURN encode(ts || rnd, 'hex')::uuid;
END;
$$;
