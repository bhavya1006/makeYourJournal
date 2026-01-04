# MakeYourJournal

Deployed at: https://make-your-journal.vercel.app

MakeYourJournal is a personal productivity and journaling web application built to help users stay consistent with their daily tasks while maintaining a habit of reflection.

The project combines task tracking, progress visualization, streak tracking, and daily journaling into a single clean and minimal dashboard experience.

This repository is designed to be contributor-friendly while still following real-world production practices.

---

## What is this project?

MakeYourJournal allows users to:

- Sign up and sign in securely using email and password
- Create daily tasks and mark them as completed
- Track task completion on a per-day basis
- View a 7-day progress overview
- Maintain current and longest streaks
- Write and view daily journal entries
- Use the app comfortably on both desktop and mobile devices

The focus of the project is simplicity, clarity, and consistency rather than feature overload.

---

## Tech stack

- React with Vite and TypeScript
- Tailwind CSS for styling
- Motion for animations
- Supabase for authentication and database
- lucide-react for icons

---

## Getting started (for contributors)

Follow these steps to run the project locally.

### 1. Fork the repository

Fork this repository on GitHub to your own account.

### 2. Clone your fork

Clone the project to your local machine:

```
git clone https://github.com/bhavya1006/makeYourJournal.git
```

Move into the project directory:

```
cd makeYourJournal
```

### 3. Install dependencies

Install all required dependencies:

```
npm install
```

### 4. Environment setup

Create a `.env` file in the root of the project and add the following values:

```
VITE_SUPABASE_URL = your_supabase_project_url  
VITE_SUPABASE_ANON_KEY = your_public_anon_key  
```

Make sure you use the public anon key and not the service role key.

### 5. Run the development server

Start the app locally:

```
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

### 6. Database setup (required)

This project uses Supabase as the backend.  
To make the app work without designing your own database, a ready-to-use SQL setup is provided.

#### How to set up the database

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Create a new query
4. Copy the contents of the file named `query.txt`
5. Paste it into the SQL Editor
6. Run the query

This will automatically:

- Create all required tables
- Set up proper relations
- Enable Row Level Security
- Add policies so users can only access their own data
- Make the app work immediately after signup

#### Tables created

- tasks  
  Stores user-created tasks

- task_completions  
  Stores per-day completion status for tasks

- journals  
  Stores daily journal entries per user

No additional database configuration is required to run or simulate the project.


---

## Supabase requirements

Before running the app, ensure the following are configured in your Supabase dashboard:

- Email and password authentication enabled
- Site URL configured correctly
- Redirect URLs set
- Email confirmation disabled for development
- Row Level Security enabled on all tables

---

## How to contribute

Contributions are welcome and encouraged.

You can contribute by:

- Improving UI and spacing
- Adding new features
- Fixing bugs
- Improving performance
- Refactoring code
- Improving documentation
- Enhancing accessibility

### Contribution workflow

1. Fork the repository
2. Create a new branch for your change  
   Example: feature/add-dark-mode
3. Make your changes
4. Commit your changes with a clear message
5. Push the branch to your fork
6. Open a Pull Request explaining what you changed and why

Please keep pull requests focused and well-documented.

---

## Security notes

- Supabase manages authentication securely
- Row Level Security ensures user data isolation
- No sensitive secrets are exposed on the frontend
- Only the public anon key is used client-side

---

## License

This project is licensed under the MIT License.

You are free to use, modify, and learn from this project.

---

`Built with the goal of encouraging consistency, reflection, and mindful productivity.
Feel free to reach out if you have any questions or need assistance!`