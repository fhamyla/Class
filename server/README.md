# ClassTrack Backend

PostgreSQL-based backend for the Attendance Management System.

## Setup

1. **Install PostgreSQL** (if not already installed)
   - Windows: https://www.postgresql.org/download/windows/
   - During installation, remember the password for the `postgres` user

2. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE classtrack_db;
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   Create a `.env` file in the server directory:
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=classtrack_db
   PORT=5000
   ```

5. **Initialize Database**
   ```bash
   npm run migrate
   ```

6. **Start Server**
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/user/:id` - Get user by ID
- `GET /api/auth/teachers` - Get all teachers (admin only)
- `POST /api/auth/teachers` - Create new teacher (admin only)
- `DELETE /api/auth/teachers/:id` - Delete teacher (admin only)

### Students
- `GET /api/students?teacherId=...` - Get students by teacher
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance?date=YYYY-MM-DD&teacherId=...` - Get attendance records
- `GET /api/attendance?studentId=...` - Get student attendance history
- `POST /api/attendance` - Save attendance records

### Admin
- `GET /api/admin/stats` - Get admin statistics

## Default Credentials

- **Admin**: `admin@classtrack.com` / `admin123`
- **Teacher 1**: `teacher@classtrack.com` / `teacher123`
- **Teacher 2**: `hoover@classtrack.com` / `teacher123`
