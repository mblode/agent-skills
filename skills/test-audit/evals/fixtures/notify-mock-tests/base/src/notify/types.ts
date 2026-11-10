export interface Alert {
  resource: string;
  message: string;
  raisedAt: Date;
}

export interface Digest {
  sendAt: Date;
  lines: string[];
}

export interface Transport {
  deliver(recipient: string, body: string): Promise<void>;
}
