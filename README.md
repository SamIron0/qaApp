# Quro

Quro is a study app for exam-style question banks. Pick a course, choose a bank, then study in **Practice** mode (instant feedback, browse at your own pace) or **Quiz** mode (shuffled, optionally timed, scored at the end). Signed-in users get bookmarks, recently-visited banks, and bank ratings.

## Features

- **Course & bank browser** — questions are organized by course (e.g. `GST 212`, `MTH 202`) and split into banks (chapters, past exams, practice sets).
- **Practice mode** — work through every question with immediate right/wrong feedback and explanations.
- **Quiz mode** — a shuffled subset of questions, optional per-question or total time limits, and a results screen with a score, breakdown, and full review.
- **Math rendering** — questions and options support inline LaTeX (`$...$`), rendered with KaTeX.
- **Accounts (Supabase Auth)** — email/password sign up, login, email verification, and password reset.
- **Bookmarks & recents** — signed-in users can bookmark banks and see a "quick access" widget of recently visited and bookmarked banks on the home page.
- **Ratings** — signed-in users can rate a question bank 1–5 stars.
- **Dark mode** — theme toggle backed by `next-themes`, respected across quiz/practice UIs.
- **Analytics** — product events (quiz started, answer submitted, quiz completed, etc.) captured with PostHog, proxied through `/ingest` to avoid ad blockers.



## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) components (Radix primitives)
- **Backend**: [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security)
- **Math rendering**: KaTeX via `react-katex`
- **Analytics**: PostHog (client + server)
- **Content**: question banks are static JSON files checked into the repo (`question-bank/`)



## Getting Started



### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (for auth, bookmarks, ratings, and recents)



### 1. Install dependencies

```bash
npm install
```



### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional — enables PostHog analytics
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your-posthog-project-token
```



### 3. Set up the database

Apply the SQL migrations in `supabase/migrations/` to your Supabase project (via the [Supabase CLI](https://supabase.com/docs/guides/cli) or the SQL editor in the dashboard), in order:

1. `001_create_profiles.sql` — profile row per user, auto-populated on signup
2. `002_create_bank_ratings.sql` — per-user 1–5 star ratings per bank
3. `003_create_bookmarks.sql` — per-user bookmarked banks
4. `004_create_bank_recent.sql` — per-user recently visited banks

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```



### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Scripts


| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Run the production server    |
| `npm run lint`  | Run ESLint                   |




## Project Structure

```
app/                    Routes (App Router)
  (auth)/               Login, signup, password reset, email verification
  courses/[courseId]/   Course → bank list → setup → practice/quiz session
  api/                  Route handlers for bookmarks and ratings
components/             UI components (quiz/practice clients, layout, auth, shadcn ui/)
lib/                    Course catalog, question loading, quiz types, quick-access data
hooks/                  Client hooks (bookmarks, ratings, dark mode)
utils/supabase/         Supabase client/server/middleware helpers
question-bank/          Question bank JSON, grouped by course code
supabase/migrations/    SQL schema for profiles, ratings, bookmarks, recents
```



## Adding a Question Bank

1. Add a JSON file under `question-bank/<course-code>/`, shaped like:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is $2 + 2$?",
      "options": { "A": "3", "B": "4", "C": "5", "D": "6" },
      "answerKey": ["B"]
    }
  ]
}
```

1. Register the bank (and course, if new) in `lib/courses.ts`, including its `questionCount`.

Inline math in `question`/`options` is wrapped in single dollar signs (`$...$`) and rendered with KaTeX via the `MathText` component.

## License

[MIT](LICENSE)