# StudyHub.ng

A polished Vite + React + TypeScript + Tailwind learning platform demo for StudyHub.ng, designed specifically for university students in Nigeria.

## Features

- Dark blue SaaS interface tailored to Nigerian university learners
- Landing and authentication screens with validated forms
- Simulated full auth flow with student and admin workspace roles
- Protected student dashboard with animated metrics and chart-style academic analytics
- Fully filterable Question Bank with search and Truth Score slider
- Question detail page with reveal-answer and practiced-state interactions
- Admin panel for uploading, previewing, editing, and deleting locally managed university mock questions
- Responsive layouts, skeleton loaders, loading/error/empty states, and smooth transitions

## Tech Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Demo Notes

- Authentication is simulated in-memory for this production-style frontend demo.
- Question management is stored locally in React state.
- Use the admin role on the auth screen to access the admin panel.
- Content and microcopy are focused on university students in Nigeria.

## File Tree

```text
.
├── README.md
├── index.html
├── package.json
├── public
│   └── favicon.svg
├── src
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── tsconfig.json
```
