"use client";

import { useId, useState } from "react";

type Status = "idle" | "pending" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    if (!EMAIL_PATTERN.test(email)) {
      setStatus("error");
      setMessage("Enter an email address like name@clinic.com.");
      return;
    }

    setStatus("pending");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("success");
      setMessage("You are subscribed. The next issue goes out on Friday.");
    } catch {
      setStatus("error");
      setMessage("We could not subscribe you. Your address is still in the box, so try again.");
    }
  }

  const invalid = status === "error";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-md flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        Email address
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={invalid}
          aria-describedby={message ? messageId : undefined}
          className="min-h-12 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive"
        />
        <button
          type="submit"
          aria-disabled={status === "pending"}
          className="min-h-12 min-w-32 rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:opacity-60"
        >
          {status === "pending" ? "Subscribing" : "Subscribe"}
        </button>
      </div>

      <p
        id={messageId}
        aria-live="polite"
        className={invalid ? "min-h-5 text-sm text-destructive" : "min-h-5 text-sm text-muted-foreground"}
      >
        {message}
      </p>
    </form>
  );
}
