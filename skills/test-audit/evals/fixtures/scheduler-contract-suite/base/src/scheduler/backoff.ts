export interface BackoffConfig {
  maxAttempts: number;
  baseDelayMs: number;
  ceilingMs: number;
  jitter: boolean;
}

export function resolveConfig(overrides: Partial<BackoffConfig> = {}): BackoffConfig {
  return {
    maxAttempts: 5,
    baseDelayMs: 2000,
    ceilingMs: 60_000,
    jitter: true,
    ...overrides,
  };
}

export function nextDelayMs(attempt: number, config: BackoffConfig, random: () => number = Math.random): number | null {
  if (attempt >= config.maxAttempts) {
    return null;
  }
  const delay = Math.min(config.baseDelayMs * 2 ** (attempt - 1), config.ceilingMs);
  if (!config.jitter) {
    return delay;
  }
  return Math.round(delay * (0.5 + random() / 2));
}
