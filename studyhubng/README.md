# StudyHub NG

> A production-grade academic study platform built for Nigerian university students. Practice past exam questions, track your performance, and master your courses — all in one place.

![StudyHub NG Admin Panel](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20%2B%20Supabase-informational?style=flat-square)

---

## What is StudyHub NG?

StudyHub NG started as a simple question bank and evolved into a full-stack learning platform. Students can browse university-level practice questions filtered by subject, difficulty, and a custom "Truth Score" (a credibility rating unique to this platform), attempt quizzes interactively, and track their progress over time. Admins can upload, edit, and manage question content — including bulk uploads via JSON — and monitor every registered user on the platform.

The design philosophy is simple: **feel premium, load fast, and never get in the student's way**.

---

## Features

### For Students
- 🔐 **Secure Authentication** — JWT-based login/signup with persistent sessions via localStorage. Password reset flow included.
- 📚 **Question Bank** — Browse hundreds of university exam questions. Filter by Subject, Difficulty, and Truth Score. Full-text search across questions, topics, and subjects — all local, no extra network calls.
- ✅ **Completed Questions** — Practiced questions automatically separate into a collapsible "Completed" section so students always know what's left.
- 🧠 **Interactive Quiz Mode** — Select an answer, submit, and instantly see colour-coded feedback with the explanation and correct answer revealed.
- 📊 **Performance Dashboard** — View total attempts, questions mastered, average score, and unique questions attempted in a clean stats panel.
- 👤 **Profile Page** — Personal account information and university/department details.
- 🚨 **Report Page** — A direct feedback channel; students can email the platform admin at `eniolaoyebamiji100@gmail.com`.

### For Admins
- 🛡️ **Admin-only Access** — Admin routes are protected via a dedicated middleware that checks `user.role` on every request.
- ✏️ **Question Management** — Create, edit, preview, and delete questions from a rich UI form. The draft preview lets admins see exactly how a question will appear before saving.
- 📤 **Bulk Upload** — Upload an entire set of questions at once by pasting a valid JSON array. Perfect for seeding the database quickly.
- 👥 **User Management** — A dedicated "Platform Users" tab shows every registered student and admin, including their name, email, role (colour-coded), and the date they joined.

### Platform-wide
- ⚡ **Fast Navigation** — Client-side routing via React Router v6 with animated transitions.
- 🎨 **Dark-mode UI** — A fully custom dark theme built with Tailwind CSS. Subject badges are colour-coded (e.g., Mathematics = red, Biology = green).
- 🔒 **Rate Limiting** — Express Rate Limiter on auth endpoints to block brute-force attacks.
- 🪖 **HTTP Security Headers** — `helmet` applied globally on the Express server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Custom JWT (jsonwebtoken + bcryptjs) |
| **Security** | helmet, express-rate-limit |
| **Deployment** | Vercel (frontend), Render/Railway (backend) |

---

## Project Structure

```
studyhubng/
│
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js     # Supabase client initialisation
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register, login, forgot/reset password
│   │   │   ├── questionController.js    # CRUD + bulk upload for questions
│   │   │   ├── performanceController.js # Record attempts, dashboard stats
│   │   │   └── userController.js        # Get user profile, list all users (admin)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js        # protect() and admin() middleware
│   │   ├── models/             # Supabase table schemas (reference only)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── questionRoutes.js
│   │   │   ├── performanceRoutes.js
│   │   │   └── userRoutes.js
│   │   └── utils/
│   ├── .env.example            # ← Copy this to .env and fill in your values
│   ├── package.json
│   └── server.js               # Entry point — sets up Express, CORS, Helmet, routes
│
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   │   ├── Field.tsx           # Labelled input wrapper
│   │   ├── Layout.tsx          # App shell (header + sidebar + main)
│   │   ├── MetricPill.tsx      # Stat badge (Truth Score, Difficulty, etc.)
│   │   ├── SelectField.tsx     # Styled <select> wrapper
│   │   ├── Sidebar.tsx         # Left-hand navigation
│   │   └── EmptyStateCard.tsx  # No-results placeholder
│   ├── pages/
│   │   ├── LandingPage.tsx     # Public marketing/landing screen
│   │   ├── AuthPage.tsx        # Login + Signup form
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── DashboardPage.tsx   # Stats overview for logged-in students
│   │   ├── QuestionBankPage.tsx # Browse, search, filter questions
│   │   ├── QuestionDetailPage.tsx # Interactive quiz screen for one question
│   │   ├── PerformancePage.tsx # Attempt history and graphs
│   │   ├── ProfilePage.tsx     # User profile
│   │   ├── AdminPage.tsx       # Admin: manage questions + view all users
│   │   └── ReportPage.tsx      # Student feedback / support
│   ├── services/
│   │   ├── api.ts              # fetchApi wrapper (base URL, auth headers, token helpers)
│   │   ├── auth.ts             # loginUser, registerUser
│   │   ├── questions.ts        # fetchQuestions, createQuestion, updateQuestion, deleteQuestion
│   │   ├── performance.ts      # recordAttempt, fetchDashboardStats
│   │   └── users.ts            # fetchUsers (admin only)
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types (Question, User, AuthForm, etc.)
│   ├── utils/
│   │   └── theme.ts            # getSubjectColor — maps subjects to Tailwind colour classes
│   ├── App.tsx                 # Root component: routing, global state, auth guards
│   ├── main.tsx                # ReactDOM entry
│   └── index.css               # Global styles + Tailwind directives
│
├── public/                     # Static assets
├── vercel.json                 # SPA fallback for Vercel deployment
├── .env.example                # Frontend env template
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Supabase](https://supabase.com) project (free tier works fine)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Eniolacode/studyhub-ng.git
cd studyhub-ng/studyhubng
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Supabase Tables

You'll need to create the following tables in your Supabase project. Go to **Table Editor → New Table** for each:

**`users`**
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, default `gen_random_uuid()` |
| `name` | text | |
| `email` | text | Unique |
| `password_hash` | text | |
| `role` | text | `'student'` or `'admin'` |
| `created_at` | timestamptz | Default `now()` |

**`questions`**
| Column | Type |
|---|---|
| `id` | text (primary key) |
| `subject` | text |
| `topic` | text |
| `exam_type` | text |
| `difficulty` | text |
| `truth_score` | int4 |
| `question` | text |
| `options` | jsonb |
| `answer` | text |
| `explanation` | text |
| `tags` | jsonb |
| `created_at` | timestamptz |

**`performance`**
| Column | Type |
|---|---|
| `id` | uuid |
| `user_id` | uuid (foreign key → users.id) |
| `question_id` | text |
| `passed` | bool |
| `attempted_at` | timestamptz |

Start the backend dev server:

```bash
npm run dev
# Server will start on http://localhost:5000
```

---

### 3. Set Up the Frontend

Open a new terminal tab:

```bash
cd ..         # back to studyhubng/
npm install
cp .env.example .env
```

The default `.env` works for local development — the API URL is already set to `http://localhost:5000/api`.

```bash
npm run dev
# App will start on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and you should see the StudyHub NG landing page.

---

### 4. Create an Admin Account

The platform automatically grants admin access to accounts registered with the email `admin@gmail.com`. To change this, update line 43 in `backend/src/controllers/authController.js`:

```js
// Change this to your own email
const assignedRole = email.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'student';
```

---

## How the Auth System Works

StudyHub NG uses **stateless JWT authentication**:

1. On login/register, the server creates a signed JWT containing `{ id, role }` and returns it to the client.
2. The client stores the token and attaches it as a `Bearer` token in the `Authorization` header on every subsequent API request.
3. The `protect` middleware on the server verifies the token on protected routes.
4. The `admin` middleware additionally checks that `user.role === 'admin'`.

**Password Reset** is also stateless — the reset token is signed with `JWT_SECRET + user.password_hash`. This means the token automatically invalidates the moment the user resets their password.

> ⚠️ **Production Note:** The forgot-password endpoint currently logs the reset link to the server console. Before going live, replace the `console.log` in `authController.js` with a real email provider (SendGrid, Resend, AWS SES, etc.).

---

### Unified Deployment → Vercel

The project is now configured for a **unified deployment** on Vercel. Both the React frontend and the Express backend will be hosted as a single Vercel project.

1. **Push your code to GitHub** (I have already done this for you).
2. Go to [vercel.com](https://vercel.com), click **Add New** → **Project**.
3. Import the `studyhub-ng` repository.
4. Vercel should automatically detect the framework (Vite).
5. **Environment Variables**: You MUST add the following variables in the Vercel dashboard:
   - `VITE_API_URL`: Set this to `https://your-project-name.vercel.app/api` (or leave blank if using the relative proxy).
   - `SUPABASE_URL`: Your Supabase URL.
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `JWT_SECRET`: A long random string for authentication.
   - `CLIENT_URL`: Your Vercel deployment URL (e.g., `https://your-project-name.vercel.app`).
6. Click **Deploy**.

The backend is served via Vercel Functions at `/api/*` and the frontend is served as a static site for all other routes.

---

## API Reference

All routes are prefixed with `/api`.

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create a new account |
| `POST` | `/auth/login` | Public | Login and receive a JWT |
| `POST` | `/auth/forgot-password` | Public | Trigger a password reset |
| `POST` | `/auth/reset-password/:id/:token` | Public | Complete a password reset |

### Questions
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/questions` | Protected | Fetch all questions |
| `POST` | `/questions` | Protected | Create a new question |
| `PUT` | `/questions/:id` | Protected | Update an existing question |
| `DELETE` | `/questions/:id` | Protected | Delete a question |
| `POST` | `/questions/bulk` | Protected | Bulk insert an array of questions |

### Performance
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/performance` | Protected | Record a quiz attempt |
| `GET` | `/performance/dashboard` | Protected | Get aggregated stats for the dashboard |

### Users
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/users/profile` | Protected | Get the logged-in user's profile |
| `PUT` | `/users/profile` | Protected | Update profile details |
| `GET` | `/users` | Admin only | List all platform users |

---

## Environment Variables Summary

### Backend (`backend/.env`)
| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Your Supabase anon/public key |
| `JWT_SECRET` | ✅ | Long random string for signing tokens |
| `PORT` | Optional | Defaults to `5000` |
| `NODE_ENV` | Optional | `development` or `production` |
| `CLIENT_URL` | ✅ | Frontend origin for CORS (e.g. `https://studyhub.vercel.app`) |

### Frontend (`studyhubng/.env`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend API base URL (e.g. `https://api.yourapp.com/api`) |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## Support

Found a bug? Have a feature request? Reach out at **eniolaoyebamiji100@gmail.com** or open an issue on GitHub.

---

## License

MIT © Eniola Oyebamiji
