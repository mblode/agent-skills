const MAIL_API_URL = process.env.MAIL_API_URL ?? "http://localhost:8025/send";

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const response = await fetch(MAIL_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ to, subject, text }),
  });
  if (!response.ok) {
    throw new Error(`mail provider returned ${response.status}`);
  }
}
