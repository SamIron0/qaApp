type AuthLike = { message?: string; code?: string };

function normalizeMessage(msg: string): string {
  return msg.trim().toLowerCase();
}

export function mapAuthError(error: unknown): string {
  const e = error as AuthLike | null | undefined;
  const code = e?.code?.toLowerCase();

  if (code === "invalid_credentials" || code === "invalid_grant") {
    return "Incorrect email or password.";
  }
  if (code === "email_not_confirmed") {
    return "Please verify your email before logging in.";
  }
  if (code === "user_already_exists") {
    return "An account with this email already exists.";
  }

  const message = typeof e?.message === "string" ? e.message : "";
  if (message) {
    const m = normalizeMessage(message);
    if (m.includes("invalid login credentials") || m.includes("invalid email or password")) {
      return "Incorrect email or password.";
    }
    if (m.includes("email not confirmed")) {
      return "Please verify your email before logging in.";
    }
    if (m.includes("user already registered")) {
      return "An account with this email already exists.";
    }
    if (m.includes("password")) {
      return "Please check your password and try again.";
    }
    return message;
  }

  return "Something went wrong. Please try again.";
}
