import { sendMail } from "../mail/send.ts";

export interface ExportPayload {
  filename: string;
  contentType: string;
  content: string;
  recipients: string[];
}

export interface DeliveryStrategy {
  deliver(payload: ExportPayload): Promise<void>;
}

export class DeliveryRegistry {
  #strategies = new Map<string, DeliveryStrategy>();

  register(name: string, strategy: DeliveryStrategy): void {
    this.#strategies.set(name, strategy);
  }

  resolve(name: string): DeliveryStrategy {
    const strategy = this.#strategies.get(name);
    if (!strategy) {
      throw new Error(`no delivery strategy named ${name}`);
    }
    return strategy;
  }
}

class EmailDelivery implements DeliveryStrategy {
  async deliver(payload: ExportPayload): Promise<void> {
    await sendMail({
      to: payload.recipients,
      subject: `Ticket export ${payload.filename}`,
      text: "Your scheduled ticket export is attached.",
      attachment: {
        filename: payload.filename,
        contentType: payload.contentType,
        content: payload.content,
      },
    });
  }
}

export const deliveryRegistry = new DeliveryRegistry();
deliveryRegistry.register("email", new EmailDelivery());
