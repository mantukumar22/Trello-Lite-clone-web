# 📋 Trello Lite — Full Stack Project Management Tool

![Trello Lite Banner](https://img.shields.io/badge/Trello%20Lite-Project%20Management-1D4ED8?style=for-the-badge)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)

A full-stack Trello-inspired project management tool with drag-and-drop task management, role-based access control, and email notifications.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://trello-lite-clone-web.vercel.app |
| Backend API | https://trello-lite-backend-233f.onrender.com |

---

## ✨ Features

- 🖱️ **Drag & Drop** — Move tasks between columns intuitively
- 🔐 **JWT Authentication** — Secure login with access + refresh tokens
- 👥 **Role-Based Access** — Admin, Member, and Viewer roles
- 📧 **Email Notifications** — Get notified when tasks are assigned or completed
- 📁 **Project Management** — Create and manage multiple projects
- 🎯 **Task Management** — Full CRUD with priority, due dates, labels, and assignees
- ⚙️ **Admin Panel** — Manage all users and their roles
- 🎨 **Beautiful UI** — Light blue & dark blue theme with Tailwind CSS

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose (Atlas) |
| Authentication | JWT (Access + Refresh Tokens) |
| Drag & Drop | @hello-pangea/dnd |
| State Management | Zustand (with persistence) |
| Email | Nodemailer (Gmail) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
trello-lite/
├── client/                        # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Board/
│   │   │   │   ├── BoardView.jsx
│   │   │   │   ├── Column.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── ProjectCard.jsx
│   │   │   ├── Modals/
│   │   │   │   ├── CreateProjectModal.jsx
│   │   │   │   ├── CreateTaskModal.jsx
│   │   │   │   └── TaskDetailModal.jsx
│   │   │   └── Shared/
│   │   │       ├── Navbar.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── AdminRoute.jsx
│   │   │       ├── InputField.jsx
│   │   │       ├── Spinner.jsx
│   │   │       └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectBoard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── projectService.js
│   │   │   ├── taskService.js
│   │   │   └── adminService.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                        # Node.js Backend
    ├── config/
    │   ├── db.js
    │   └── mailer.js
    ├── controllers/
    │   ├── authController.js
    │   ├── projectController.js
    │   ├── taskController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── roleMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   └── Task.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── projectRoutes.js
    │   ├── taskRoutes.js
    │   └── adminRoutes.js
    ├── services/
    │   └── emailService.js
    ├── utils/
    │   └── generateTokens.js
    ├── .env
    └── index.js
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org) v18+ (LTS recommended)
- [Git](https://git-scm.com)
- [MongoDB Atlas](https://mongodb.com/atlas) account (free)
- Gmail account with App Password enabled

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/trello-lite.git
cd trello-lite
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/trellolite
ACCESS_SECRET=your_long_random_access_secret
REFRESH_SECRET=your_long_random_refresh_secret
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **How to get Gmail App Password:**
> Google Account → Security → 2-Step Verification (enable) → App Passwords → Generate

Start the backend server:

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

---

### 3. Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local: http://localhost:5173/
```

---

### 4. Open the App

Go to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👤 User Roles

| Role | Permissions |
|---|---|
| **Admin** | Create/delete projects, manage members, change user roles, delete any task, access Admin Panel |
| **Member** | Create/update/move tasks, view all projects they belong to |
| **Viewer** | View-only access to projects and tasks, cannot create or modify anything |

---

## 🔑 How to Use as Admin

### Step 1 — Register an Account

1. Go to the app and click **"Create one"** on the login page
2. Fill in your name, email, and password
3. Click **"Create Account"**
4. You will be redirected to login

### Step 2 — Set Your Role to Admin

By default, all new users get the `member` role. To become admin:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **"Browse Collections"**
3. Find your database → click the **`users`** collection
4. Find your user document by email
5. Click the **edit (pencil) icon**
6. Change `role: "member"` to `role: "admin"`
7. Click **Update**

> After the first admin is set, all future role changes can be done from the Admin Panel UI — no need to touch Atlas again.

### Step 3 — Login and Access Admin Panel

1. Go back to the app → Login
2. You will see **"⚙ Admin Panel"** in the navbar
3. Click it to manage all users

---

## ⚙️ Admin Panel Guide

The Admin Panel is available only to users with the `admin` role.

### Accessing the Admin Panel

- Click **"⚙ Admin Panel"** in the top navigation bar
- Direct URL: `/admin`

### What You Can Do

**View Stats:**
- Total number of users
- Number of admins, members, and viewers

**Manage Users:**
- See all registered users with their name, email, role, and join date
- Change any user's role using the dropdown in the table
- Available roles: `admin`, `member`, `viewer`

> You cannot change your own role from the Admin Panel for security reasons.

### Managing Project Members

As an admin/project owner you can add members to a project:

1. Go to a project board
2. In Atlas or via API, use `POST /api/projects/:id/members`
3. Body: `{ "email": "user@example.com", "role": "member" }`

---

## 📋 How to Use the App

### Creating a Project (Admin only)

1. Login as admin
2. On the Dashboard, click **"+ New Project"**
3. Enter a project title and optional description
4. Click **"Create Project"**
5. The project appears instantly on the dashboard

### Opening a Project Board

1. Click **"Open Board →"** on any project card
2. You will see the Kanban board with 3 default columns:
   - **To Do** (blue)
   - **In Progress** (yellow)
   - **Done** (green)

### Creating a Task

1. Click **"+ Add Task"** button (top right of board) or
2. Click **"+ Add Task"** button at the bottom of any column
3. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** — Low / Medium / High
   - **Due Date** (optional)
   - **Assignee Email** (optional — sends email notification)
4. Click **"Create Task"**

### Moving Tasks (Drag & Drop)

1. Click and hold any task card
2. Drag it to another column
3. Release to drop
4. The position is saved automatically

### Viewing & Editing a Task

1. Click on any task card
2. A detail modal opens showing all task information
3. Click **"Edit Task"** to modify title, description, or priority
4. Click **"Save Changes"** to update

### Deleting a Task

- **From the board:** Hover over a task card → click the **✕** button
- **From the detail modal:** Click the **"Delete"** button

---

## 🔌 API Reference

### Base URL
```
Local:      http://localhost:5000/api
Production: https://trello-lite-backend-233f.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and get tokens |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Protected | Logout user |

### Project Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/projects` | Member+ | Get all your projects |
| POST | `/projects` | Admin | Create new project |
| GET | `/projects/:id` | Member+ | Get single project |
| PUT | `/projects/:id` | Owner | Update project |
| DELETE | `/projects/:id` | Owner | Delete project |
| POST | `/projects/:id/members` | Owner | Add member to project |

### Task Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/projects/:id/tasks` | Member+ | Get all tasks in project |
| POST | `/projects/:id/tasks` | Member+ | Create new task |
| GET | `/tasks/:id` | Member+ | Get single task |
| PUT | `/tasks/:id` | Member+ | Update task |
| PUT | `/tasks/:id/move` | Member+ | Move task (drag & drop) |
| DELETE | `/tasks/:id` | Owner/Creator | Delete task |

### Admin Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/users` | Admin | Get all users |
| PUT | `/admin/users/:id/role` | Admin | Change user role |
| GET | `/admin/stats` | Admin | Get user statistics |

### Example API Requests

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Create Task:**
```json
POST /api/projects/:projectId/tasks
Authorization: Bearer <access_token>
{
  "title": "Design the homepage",
  "description": "Create wireframes",
  "priority": "high",
  "assigneeEmail": "jane@example.com",
  "dueDate": "2024-12-31"
}
```

**Move Task:**
```json
PUT /api/tasks/:taskId/move
Authorization: Bearer <access_token>
{
  "newStatus": "inprogress",
  "newOrder": 0
}
```

---

## 🗄️ Database Schema

### User
```
_id           ObjectId
name          String (required)
email         String (required, unique)
password      String (hashed with bcrypt)
role          String (admin | member | viewer, default: member)
refreshToken  String
createdAt     Date
updatedAt     Date
```

### Project
```
_id           ObjectId
title         String (required)
description   String
owner         ObjectId → User
members       Array [{ user: ObjectId, role: String }]
columns       Array [{ id: String, title: String }]
createdAt     Date
updatedAt     Date
```

### Task
```
_id           ObjectId
title         String (required)
description   String
status        String (todo | inprogress | done)
priority      String (low | medium | high)
order         Number (for drag & drop ordering)
project       ObjectId → Project
assignee      ObjectId → User
createdBy     ObjectId → User
dueDate       Date
labels        Array [String]
createdAt     Date
updatedAt     Date
```

---

## 🌍 Deployment

### Frontend — Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set Root Directory to `client`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-render-url.onrender.com/api
   ```
5. Deploy

### Backend — Render

1. Go to [render.com](https://render.com) → New Web Service
2. Set Root Directory to `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables from `.env`
6. Deploy

### MongoDB — Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Network Access → Allow `0.0.0.0/0`
3. Copy connection string to `MONGO_URI`

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT **access tokens** expire in 15 minutes
- JWT **refresh tokens** expire in 7 days, stored as HTTP-only cookies
- Role-based access enforced on **both frontend and backend**
- Owner checks on project and task operations
- Environment variables for all secrets

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|---|---|
| CORS error on deployment | Remove trailing slash from `CLIENT_URL` in Render env vars |
| 404 on API calls | Make sure `VITE_API_URL` ends with `/api` |
| Login works but role is wrong | Clear localStorage → logout → login again |
| Email not sending | Check Gmail App Password in `.env`, ensure 2FA is on |
| Page refresh gives 404 on Vercel | Add `vercel.json` with rewrites config |
| Render app slow to respond | Free tier sleeps — use UptimeRobot to ping every 5 min |
| Drag and drop not saving | Check `PUT /tasks/:id/move` in network tab |
| MongoDB connection failed | Check Atlas Network Access allows `0.0.0.0/0` |

---

## 📦 Available Scripts

### Backend (`server/`)
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start for production
```

### Frontend (`client/`)
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build locally
```

---

## 🛣️ Roadmap

- [ ] Search tasks across board
- [ ] Filter tasks by priority / assignee
- [ ] Comments on tasks
- [ ] Task activity log
- [ ] File attachments
- [ ] Custom columns (add/rename/delete)
- [ ] Due date email reminders
- [ ] Dark mode
- [ ] Mobile responsive board
- [ ] Google OAuth login

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for personal or commercial projects.

---

## 👨‍💻 Author

Built with ❤️ as a full-stack learning project.

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Guided step-by-step from scratch

---

## 🙏 Acknowledgements

- [React DnD / @hello-pangea/dnd](https://github.com/hello-pangea/dnd) — Drag and drop
- [Nodemailer](https://nodemailer.com) — Email notifications
- [Zustand](https://zustand-demo.pmnd.rs) — State management
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [MongoDB Atlas](https://mongodb.com/atlas) — Database hosting
- [Vercel](https://vercel.com) — Frontend hosting
- [Render](https://render.com) — Backend hosting