export interface MailAttachment {
  filename: string;
  contentType: string;
  content: string;
}

export interface MailMessage {
  to: string[];
  subject: string;
  text: string;
  attachment?: MailAttachment;
}

export type Transport = (message: MailMessage) => Promise<void>;

const MAIL_API_URL = process.env.MAIL_API_URL ?? "http://localhost:8025/api/send";

let transport: Transport = async (message) => {
  const response = await fetch(MAIL_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error(`mail api returned ${response.status}`);
  }
};

export function setTransport(next: Transport): void {
  transport = next;
}

export async function sendMail(message: MailMessage): Promise<void> {
  if (message.to.length === 0) {
    throw new Error("mail needs at least one recipient");
  }
  await transport(message);
}
