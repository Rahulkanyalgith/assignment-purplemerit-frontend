# User Management System - Frontend

A modern, responsive React application with role-based access control (Admin & User). Features secure authentication, admin dashboard, user profiles, and full mobile responsiveness.

## 🛠 Tech Stack

- **React 18+** with React Router v6
- **Pure CSS3** with custom design system
- **React Context API** for state management
- **Axios** for API requests
- **React Icons** & **React Hot Toast** for UI components

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm v6+
- Backend running on `http://localhost:5000`

### Installation

```bash
# Clone & install
git clone <repository-url>
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start dev server
npm start
```

Opens at `http://localhost:3000`

**Test Credentials:**
- Admin: admin@example.com / Admin@123
- User: john@example.com / User@123

## 📋 Commands

```bash
npm start      # Dev server with hot reload
npm run build  # Production build
npm test       # Run unit tests
```

## 🔐 Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```



## 📡 API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

**Auth:**
- `POST /api/auth/login` — Login user
- `POST /api/auth/signup` — Register new user

**User:**
- `GET /api/users/profile` — Get current user profile
- `PUT /api/users/profile` — Update user profile

**Admin:**
- `GET /api/admin/users` — Get all users (paginated)
- `PUT /api/admin/users/:userId` — Update user role
- `DELETE /api/admin/users/:userId` — Delete user


## 🧪 Testing

```bash
npm test
```


### Recommended Test Credentials
- **Admin Account:** admin@example.com / Admin@123
- **User Account:** john@example.com / User@123

