# ClassTrack - Full Stack Setup Guide

This project now uses a **PostgreSQL database** with a **Node.js/Express backend** instead of localStorage.

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+

## 1. PostgreSQL Setup

### Windows

1. **Download and Install PostgreSQL**
   - Go to https://www.postgresql.org/download/windows/
   - Run the installer
   - Remember the password you set for the `postgres` user
   - Keep the port as `5432` (default)

2. **Create Database**

   ```bash
   # Open PostgreSQL command line (psql)
   # Windows: Search for "SQL Shell (psql)" in Start Menu

   # Or from command line:
   psql -U postgres

   # Then run:
   CREATE DATABASE classtrack_db;
   ```

### Linux/Mac

```bash
# Install PostgreSQL (using Homebrew on Mac)
brew install postgresql
brew services start postgresql

# Or on Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb classtrack_db
```

## 2. Backend Setup

```bash
# Install backend dependencies
cd server
npm install

# Create .env file with database credentials
cp .env.example .env

# Edit .env with your PostgreSQL password
# DB_PASSWORD=your_postgres_password
```

### Initialize Database

```bash
cd server
npm run migrate
```

This will:

- Create all tables (users, teachers, students, attendance_records)
- Create indexes for performance
- Seed initial data with demo users

### Start Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

## 3. Frontend Setup

```bash
# From root directory
npm install

# Start frontend (in a new terminal)
npm run dev
```

Frontend will run on `http://localhost:5173`

## 4. Running Full Stack

Run everything together:

```bash
npm run dev:full
```

This uses `concurrently` to run:

- Frontend dev server (Vite)
- Backend dev server (Express)

## Default Credentials

| Role      | Email                    | Password     |
| --------- | ------------------------ | ------------ |
| Admin     | `admin@classtrack.com`   | `admin123`   |
| Teacher 1 | `teacher@classtrack.com` | `teacher123` |
| Teacher 2 | `hoover@classtrack.com`  | `teacher123` |

## Database Schema

### Users Table

- `id` (UUID, PK)
- `email` (Unique)
- `password_hash` (bcrypt)
- `role` (admin, teacher)
- `name`
- `created_at`, `updated_at`

### Teachers Table

- `id` (UUID, PK)
- `user_id` (FK → users)
- `name`
- `email`
- `created_at`

### Students Table

- `id` (UUID, PK)
- `name`
- `teacher_id` (FK → teachers)
- `created_at`, `updated_at`

### Attendance Records Table

- `id` (UUID, PK)
- `student_id` (FK → students)
- `teacher_id` (FK → teachers)
- `date` (DATE)
- `status` (present, absent)
- `marked_at`
- **Unique Constraint**: One record per student per date

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `GET /api/auth/user/:id` - Get user
- `GET /api/auth/teachers` - List teachers
- `POST /api/auth/teachers` - Create teacher
- `DELETE /api/auth/teachers/:id` - Delete teacher

### Students

- `GET /api/students?teacherId=...` - Get students
- `POST /api/students` - Create student
- `DELETE /api/students/:id` - Delete student

### Attendance

- `GET /api/attendance?date=YYYY-MM-DD&teacherId=...` - Get attendance
- `GET /api/attendance?studentId=...` - Get history
- `POST /api/attendance` - Save attendance

### Admin

- `GET /api/admin/stats` - Get statistics

## Troubleshooting

### "Cannot connect to database" error

1. Verify PostgreSQL is running:

   ```bash
   # Windows: Check Services (Services.msc)
   # Linux: systemctl status postgresql
   # Mac: brew services list
   ```

2. Check `.env` file in `server/` directory has correct credentials

3. Test connection:
   ```bash
   psql -U postgres -d classtrack_db
   ```

### "Port 5000 already in use"

```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

### "Tables already exist" during migration

This is normal - the migration script creates tables only if they don't exist. To reset:

```bash
# Connect to database and drop tables
psql -U postgres -d classtrack_db

DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# Then run migration again
npm run migrate
```

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=classtrack_db
PORT=5000
```

## File Structure

```
Class/
├── src/                    # React frontend
│   ├── components/
│   ├── services/
│   │   └── mockApi.ts     # Updated to use API
│   └── types/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.ts    # Database connection
│   │   │   └── migrate.ts # Schema initialization
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API endpoints
│   │   └── index.ts       # Express server
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── .env                    # Frontend config
```

## Next Steps

1. Set up PostgreSQL
2. Install dependencies: `npm install` and `cd server && npm install`
3. Create `.env` file in `server/` with your database credentials
4. Run migration: `npm run server:migrate`
5. Start full stack: `npm run dev:full`
6. Open browser to `http://localhost:5173`
7. Login with demo credentials above

## Production Deployment

For production:

1. Use environment-specific `.env` files
2. Set `NODE_ENV=production`
3. Use connection pooling
4. Enable HTTPS
5. Add authentication tokens (JWT)
6. Use a process manager (PM2, systemd)
7. Set up database backups
