
 -- The following SQL statements are used to allow aggregate functions in PostgREST
 ALTER ROLE authenticator
 SET pgrst.db_aggregates_enabled = 'true';
 NOTIFY pgrst,
 'reload config';