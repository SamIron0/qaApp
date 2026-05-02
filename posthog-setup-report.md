<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Practice Q&A app. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest`. Environment variables are stored in `.env.local` and never hardcoded.

Users are identified by their Supabase UUID on successful login and signup, enabling accurate per-user analytics across both email and Google OAuth flows. A `posthog.reset()` call on sign-out ensures anonymous users are not accidentally linked to authenticated sessions.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates an account via email/password | `app/(auth)/signup/page.tsx` |
| `user_signed_up_with_google` | User initiates account creation via Google OAuth | `app/(auth)/signup/page.tsx` |
| `user_logged_in` | User successfully signs in with email and password | `app/(auth)/login/login-form.tsx` |
| `user_logged_in_with_google` | User initiates sign-in via Google OAuth | `app/(auth)/login/login-form.tsx` |
| `user_logged_out` | User signs out | `components/layout/SignOutButton.tsx` |
| `password_reset_requested` | User requests a password reset link | `app/(auth)/forgot-password/page.tsx` |
| `quiz_bank_started` | Authenticated user clicks a question bank to start a quiz | `components/courses/BankCard.tsx` |
| `quiz_answer_submitted` | User selects an answer option (includes correctness, course/bank context) | `components/PracticeModeClient.tsx` |
| `quiz_question_navigated` | User navigates to the next or previous question | `components/PracticeModeClient.tsx` |

## Files created/modified

| File | Change |
|---|---|
| `instrumentation-client.ts` | **Created** — PostHog client-side initialization |
| `next.config.ts` | **Modified** — Added `/ingest` reverse proxy rewrites |
| `.env.local` | **Modified** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `app/(auth)/login/login-form.tsx` | **Modified** — Added `user_logged_in`, `user_logged_in_with_google`, `posthog.identify` |
| `app/(auth)/signup/page.tsx` | **Modified** — Added `user_signed_up`, `user_signed_up_with_google`, `posthog.identify` |
| `app/(auth)/forgot-password/page.tsx` | **Modified** — Added `password_reset_requested` |
| `components/layout/SignOutButton.tsx` | **Modified** — Added `user_logged_out`, `posthog.reset` |
| `components/courses/BankCard.tsx` | **Modified** — Added `quiz_bank_started` |
| `components/PracticeModeClient.tsx` | **Modified** — Added `quiz_answer_submitted`, `quiz_question_navigated` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/406756/dashboard/1536467
- **New User Activation Funnel**: https://us.posthog.com/project/406756/insights/ePhOyx9u
- **Daily Active Users (Logins)**: https://us.posthog.com/project/406756/insights/qVCt5Bp6
- **Quiz Answer Accuracy Rate**: https://us.posthog.com/project/406756/insights/bePqHAcW
- **Most Popular Question Banks**: https://us.posthog.com/project/406756/insights/p7fx2MtY
- **Sign-up & Churn Events**: https://us.posthog.com/project/406756/insights/tO1s80xr

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
