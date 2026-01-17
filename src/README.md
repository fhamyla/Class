
# Class - Attendance Management System

A comprehensive, role-based attendance management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication & Roles
- **Secure Login/Logout**: Role-based access control.
- **Admin Role**: Manage teachers, view system-wide statistics.
- **Teacher Role**: Manage assigned students, mark attendance, view history.

### Core Functionality
- **Student Management**: CRUD operations for student profiles.
- **Attendance Tracking**: Mark present/absent, view history, calculate absence rates.
- **Dashboards**: Visual statistics for both Admins and Teachers.
- **Responsive Design**: Mobile-first approach working seamlessly across devices.

## 🏗 Architecture

This project uses a **Frontend-First** architecture with a simulated backend.

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Context API (AuthContext)
- **Routing**: React Router (simulated via state for simplicity in this demo, or react-router-dom if installed)
- **Backend Simulation**: `services/mockApi.ts` intercepts calls and persists data to `localStorage`.
  - This allows the app to function fully without a running server.
  - To connect a real backend, simply replace the functions in `mockApi.ts` with real `fetch` or `axios` calls.

## 🛠 Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Locally**
   ```bash
   npm run dev
   ```

3. **Default Credentials**
   - **Admin**: `admin@classtrack.com` / `admin123`
   - **Teacher**: `teacher@classtrack.com` / `teacher123`

## 📂 Project Structure

- `/components`: UI components (Admin, Teacher, Shared)
- `/contexts`: Global state (Auth)
- `/hooks`: Custom hooks (useAuth, useLocalStorage)
- `/services`: Mock API layer (simulating backend)
- `/types`: TypeScript interfaces

## 🎨 Design System

- **Colors**: "Tranquil Earth" palette (Sage, Moss, Warm Gray, Blush, Cream)
- **Typography**: Inter/System Sans
- **Accessibility**: WCAG AA compliant, keyboard navigable, screen reader friendly.
