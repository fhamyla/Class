# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "admin@classtrack.com",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "id": "uuid",
  "email": "admin@classtrack.com",
  "name": "Principal Skinner",
  "role": "admin",
  "createdAt": "2024-01-19T10:00:00Z"
}
```

**Errors:**

- `401` - Invalid credentials

---

### GET /auth/user/:id

Get user by ID.

**Response (200):**

```json
{
  "id": "uuid",
  "email": "admin@classtrack.com",
  "name": "Principal Skinner",
  "role": "admin",
  "createdAt": "2024-01-19T10:00:00Z"
}
```

**Errors:**

- `404` - User not found

---

### GET /auth/teachers

Get all teachers.

**Response (200):**

```json
[
  {
    "id": "uuid",
    "email": "teacher@classtrack.com",
    "name": "Ms. Krabappel",
    "role": "teacher",
    "createdAt": "2024-01-19T10:00:00Z"
  }
]
```

---

### POST /auth/teachers

Create a new teacher (admin only).

**Request:**

```json
{
  "name": "New Teacher",
  "email": "newteacher@classtrack.com",
  "password": "securepassword"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "email": "newteacher@classtrack.com",
  "name": "New Teacher",
  "role": "teacher",
  "createdAt": "2024-01-19T10:00:00Z"
}
```

**Errors:**

- `400` - Email already exists or missing required fields

---

### DELETE /auth/teachers/:id

Delete a teacher.

**Response (200):**

```json
{
  "success": true
}
```

---

## Student Endpoints

### GET /students

Get students by teacher or all students.

**Query Parameters:**

- `teacherId` (optional) - Filter by teacher

**Response (200):**

```json
[
  {
    "id": "uuid",
    "name": "Bart Simpson",
    "teacherId": "uuid",
    "createdAt": "2024-01-19T10:00:00Z"
  }
]
```

---

### POST /students

Create a new student.

**Request:**

```json
{
  "name": "New Student",
  "teacherId": "teacher-uuid"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "name": "New Student",
  "teacherId": "teacher-uuid",
  "createdAt": "2024-01-19T10:00:00Z"
}
```

**Errors:**

- `400` - Missing required fields

---

### DELETE /students/:id

Delete a student.

**Response (200):**

```json
{
  "success": true
}
```

---

## Attendance Endpoints

### GET /attendance

Get attendance records.

**Query Parameters:**

- `date` - Get records for specific date (format: YYYY-MM-DD)
- `teacherId` - Filter by teacher (required if date is specified)
- `studentId` - Get history for specific student (alternative to date/teacherId)

**Example Queries:**

```
GET /attendance?date=2024-01-19&teacherId=uuid
GET /attendance?studentId=uuid
```

**Response (200):**

```json
[
  {
    "id": "uuid",
    "date": "2024-01-19",
    "studentId": "uuid",
    "teacherId": "uuid",
    "status": "present",
    "markedAt": "2024-01-19T14:30:00Z"
  }
]
```

---

### POST /attendance

Save or update attendance records.

**Request:**

```json
{
  "date": "2024-01-19",
  "teacherId": "uuid",
  "updates": [
    {
      "studentId": "uuid",
      "status": "present"
    },
    {
      "studentId": "uuid2",
      "status": "absent"
    }
  ]
}
```

**Response (200):**

```json
{
  "success": true
}
```

**Notes:**

- Automatically replaces previous attendance for the same date/student
- Ensures one record per student per date (unique constraint)

**Errors:**

- `400` - Missing required fields

---

## Admin Endpoints

### GET /admin/stats

Get system-wide statistics.

**Response (200):**

```json
{
  "totalTeachers": 2,
  "totalStudents": 5,
  "teacherStats": [
    {
      "id": "uuid",
      "email": "teacher@classtrack.com",
      "name": "Ms. Krabappel",
      "role": "teacher",
      "createdAt": "2024-01-19T10:00:00Z",
      "studentCount": 3
    },
    {
      "id": "uuid2",
      "email": "hoover@classtrack.com",
      "name": "Ms. Hoover",
      "role": "teacher",
      "createdAt": "2024-01-19T10:00:00Z",
      "studentCount": 2
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Description of the error"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid input or missing required fields
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:

- Implementing rate limiting middleware
- Adding request validation
- Using JWT tokens for stateless authentication

---

## Database Constraints

### Unique Constraints

- Email must be unique across users
- One attendance record per student per date

### Foreign Keys

- Teachers must reference an existing user
- Students must reference an existing teacher
- Attendance must reference existing student and teacher

### Data Types

- IDs are UUIDs (version 4)
- Dates are ISO 8601 format
- Passwords are bcrypt hashed (not sent in responses)

---

## Frontend Integration

The frontend uses `src/services/mockApi.ts` to make all API calls:

```typescript
// Configure API URL in .env
VITE_API_URL=http://localhost:5000/api

// All data flows through mockApi
import { mockApi } from '../services/mockApi';

await mockApi.login(email, password);
await mockApi.getStudentsByTeacher(teacherId);
await mockApi.saveAttendance(date, teacherId, updates);
```

To switch back to localStorage (for development without backend):

- Update the API_BASE_URL in mockApi.ts
- Or revert to the original localStorage implementation
