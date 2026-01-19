# Quick Start Guide

## Prerequisites
- Node.js 16+
- PostgreSQL 12+

## Installation Steps

### 1. PostgreSQL Database Setup

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Install and remember your postgres password
3. Open PowerShell and run:
```powershell
psql -U postgres
```
4. Create database:
```sql
CREATE DATABASE classtrack_db;
\q
```

**Mac/Linux:**
```bash
brew install postgresql      # Mac
brew services start postgresql

# Or Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb classtrack_db
```

### 2. Backend Setup

```powershell
cd server
npm install
cp .env.example .env
# Edit .env with your postgres password (usually 'postgres' if using default)
npm run migrate
npm run dev
```

Backend runs on: **http://localhost:5000**

### 3. Frontend Setup (New Terminal)

```powershell
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 4. Login Credentials

| Type | Email | Password |
|------|-------|----------|
| Admin | admin@classtrack.com | admin123 |
| Teacher | teacher@classtrack.com | teacher123 |
| Teacher | hoover@classtrack.com | teacher123 |

## Run Everything at Once

```powershell
npm run dev:full
```

## Database Info

All data is stored in PostgreSQL:
- **Host:** localhost
- **Port:** 5432
- **Database:** classtrack_db
- **User:** postgres
- **Tables:** users, teachers, students, attendance_records

## Troubleshooting

**Port 5000 in use?**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Can't connect to database?**
- Make sure PostgreSQL is running
- Check .env file has correct password
- Verify database exists: `psql -U postgres -l`

**Reset database?**
```powershell
psql -U postgres -d classtrack_db
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
\q

# Then run migration again
npm run migrate
```

## What's New

✅ PostgreSQL database instead of localStorage
✅ Express backend API
✅ Password authentication with bcrypt hashing
✅ Multiple API endpoints for data management
✅ Full CRUD operations
✅ Attendance tracking with date/student uniqueness
✅ Admin statistics aggregated from database

## File Structure

```
Class/
├── server/           # Node.js/Express backend
│   ├── src/
│   │   ├── db/       # Database setup
│   │   ├── services/ # Business logic
│   │   ├── routes/   # API endpoints
│   │   └── index.ts  # Server entry
│   └── package.json
├── src/              # React frontend
│   └── services/
│       └── mockApi.ts # Updated to call API
├── .env              # Frontend config
└── package.json
```

Enjoy! 🎓
