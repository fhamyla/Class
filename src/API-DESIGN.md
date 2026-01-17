
# ClassTrack API Design Documentation

This document outlines the RESTful API endpoints for the Attendance Management System.

## Base URL
`https://api.classtrack.com/v1`

## Authentication

### Login
- **POST** `/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "token": "jwt_token", "user": { "id": "...", "role": "..." } }`

### Logout
- **POST** `/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "message": "Logged out successfully" }`

### Get Current User
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

## Admin Endpoints

### Manage Teachers
- **GET** `/admin/teachers` - List all teachers (with student counts)
- **POST** `/admin/teachers` - Create a new teacher account
- **GET** `/admin/teachers/:id` - Get specific teacher details
- **PUT** `/admin/teachers/:id` - Update teacher details
- **DELETE** `/admin/teachers/:id` - Remove a teacher (and reassign/delete their students)

### Admin Dashboard Stats
- **GET** `/admin/stats`
- **Response**:
  ```json
  {
    "totalTeachers": 12,
    "totalStudents": 450,
    "recentActivity": [...]
  }
  ```

## Teacher Endpoints

### Manage Students
- **GET** `/teacher/students` - List all students assigned to the authenticated teacher
- **POST** `/teacher/students` - Add a new student to class
- **GET** `/teacher/students/:id` - Get student profile
- **PUT** `/teacher/students/:id` - Update student details
- **DELETE** `/teacher/students/:id` - Remove a student

### Attendance Management
- **GET** `/teacher/attendance` - Get attendance records (filter by date/student)
  - Query Params: `?date=YYYY-MM-DD` or `?studentId=...`
- **POST** `/teacher/attendance` - Mark attendance
  - **Body**:
    ```json
    {
      "date": "2023-10-25",
      "records": [
        { "studentId": "123", "status": "present" },
        { "studentId": "456", "status": "absent" }
      ]
    }
    ```
- **GET** `/teacher/stats` - Get teacher dashboard stats (attendance rates, total students)

## Error Handling
All endpoints return standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (Validation error)
- 401: Unauthorized (Invalid/missing token)
- 403: Forbidden (Admin accessing teacher route or vice versa)
- 404: Not Found
- 500: Server Error
