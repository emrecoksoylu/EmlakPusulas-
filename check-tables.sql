-- Check all schemas and tables
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename IN ('Agent', 'agent', 'Customer', 'customer', 'Listing', 'listing')
ORDER BY schemaname, tablename;

-- If nothing shows up, check ALL tables:
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;
