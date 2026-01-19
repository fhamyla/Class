# PostgreSQL Commands Reference

## Connection

```bash
# Connect to PostgreSQL as default postgres user
psql -U postgres

# Connect to a specific database
psql -U postgres -d classtrack_db

# Connect with password prompt
psql -U postgres -W

# Connect from command line
psql -U postgres -d classtrack_db -c "SELECT * FROM users;"
```

## Database Management

```sql
-- List all databases
\l

-- Create database
CREATE DATABASE classtrack_db;

-- Drop database
DROP DATABASE classtrack_db;

-- Switch to a database
\c classtrack_db

-- Show current database
SELECT current_database();
```

## Table Operations

```sql
-- List tables in current database
\dt

-- Describe table structure
\d users

-- Show table details with data types
\d+ users

-- List all indexes
\di

-- List sequences
\ds
```

## Data Queries

```sql
-- Show all users
SELECT * FROM users;

-- Show all teachers with student count
SELECT 
  u.name, 
  u.email, 
  COUNT(s.id) as student_count
FROM users u
LEFT JOIN teachers t ON u.id = t.user_id
LEFT JOIN students s ON t.id = s.teacher_id
WHERE u.role = 'teacher'
GROUP BY u.id, u.name, u.email;

-- Show attendance for a specific date
SELECT s.name, ar.status, ar.marked_at
FROM attendance_records ar
JOIN students s ON ar.student_id = s.id
WHERE ar.date = '2024-01-19'
ORDER BY s.name;

-- Show student attendance history
SELECT date, status, marked_at
FROM attendance_records
WHERE student_id = 'student-uuid'
ORDER BY date DESC;

-- Calculate absence rate for a student
SELECT 
  s.name,
  COUNT(*) as total_records,
  SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) as absences,
  ROUND(100.0 * SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) / COUNT(*), 2) as absence_rate
FROM attendance_records ar
JOIN students s ON ar.student_id = s.id
GROUP BY s.id, s.name;
```

## User Management

```sql
-- Create new admin user
INSERT INTO users (id, email, password_hash, role, name) 
VALUES ('new-id', 'admin2@test.com', 'hash_here', 'admin', 'New Admin');

-- Change user password (requires bcrypt hash)
UPDATE users SET password_hash = 'new_hash' WHERE email = 'user@test.com';

-- Delete user
DELETE FROM users WHERE id = 'user-id';
```

## Backup & Restore

```bash
# Backup entire database
pg_dump -U postgres classtrack_db > backup.sql

# Backup specific table
pg_dump -U postgres -t students classtrack_db > students_backup.sql

# Restore from backup
psql -U postgres classtrack_db < backup.sql

# Backup as custom format (smaller size)
pg_dump -U postgres -F c classtrack_db > backup.dump

# Restore from custom format
pg_restore -U postgres -d classtrack_db backup.dump
```

## Performance & Monitoring

```sql
-- Show table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Show index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Show slow queries (requires logging enabled)
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Database Maintenance

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Analyze specific table
ANALYZE users;

-- Vacuum to reclaim space
VACUUM;

-- Full vacuum (locks tables)
VACUUM FULL;

-- Check database integrity
REINDEX DATABASE classtrack_db;
```

## Exit & Help

```bash
# Exit psql
\q

# Show psql help
\?

# Show SQL help
\h

# Show specific command help
\h SELECT
```

## Common Issues

### Reset AutoIncrement/Sequence
```sql
-- If using sequences
SELECT setval('table_id_seq', (SELECT MAX(id) FROM table));
```

### Drop All Tables
```sql
-- Drop all tables in schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('classtrack_db'));
```

### List Active Connections
```sql
SELECT datname, usename, application_name, state, query
FROM pg_stat_activity
WHERE datname = 'classtrack_db';
```

### Kill Connection
```sql
-- For PostgreSQL 13+
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'classtrack_db' AND pid <> pg_backend_pid();

-- For older versions
SELECT pg_terminate_backend(procpid)
FROM pg_stat_activity
WHERE datname = 'classtrack_db' AND procpid <> pg_backend_pid();
```

## Environment Variables

```bash
# Linux/Mac ~/.bashrc or ~/.zshrc
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres

# Then use psql without parameters
psql -d classtrack_db

# Windows (PowerShell)
$env:PGHOST="localhost"
$env:PGPORT="5432"
$env:PGUSER="postgres"
$env:PGPASSWORD="postgres"
```

## Useful Aliases

Add to ~/.psqlrc to create custom commands:

```sql
-- List top 10 largest tables
\set top_tables 'SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'\''.'\''||tablename)) AS size FROM pg_tables WHERE schemaname NOT IN (''pg_catalog'', ''information_schema'') ORDER BY pg_total_relation_size(schemaname||'\''.'\''||tablename) DESC LIMIT 10;'

-- Usage: :top_tables
```

## Default PostgreSQL Ports & Credentials

- **Host:** localhost
- **Port:** 5432 (default)
- **User:** postgres (default)
- **Password:** (set during installation)
- **Database:** classtrack_db (created)

## Installation Verification

```bash
# Check PostgreSQL version
psql --version

# Test connection
psql -U postgres -d classtrack_db -c "SELECT now();"

# Should output current timestamp if connected successfully
```

---

For more help: https://www.postgresql.org/docs/current/
