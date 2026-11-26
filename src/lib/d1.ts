import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = Record<string, unknown>>(colName?: string) => Promise<T | null>;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
  run: () => Promise<D1Result>;
}

export interface D1DatabaseLike {
  prepare: (query: string) => D1PreparedStatement;
  batch: <T = Record<string, unknown>>(
    statements: D1PreparedStatement[]
  ) => Promise<D1Result<T>[]>;
}

export interface WorkerEnv {
  DB?: D1DatabaseLike;
  ADMIN_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_TILES_BASE_URL?: string;
}

export async function getWorkerEnv(): Promise<WorkerEnv> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return (ctx?.env as WorkerEnv) ?? {};
  } catch {
    return {
      ADMIN_TOKEN: process.env.ADMIN_TOKEN,
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    };
  }
}

export async function getDB(): Promise<D1DatabaseLike | null> {
  const env = await getWorkerEnv();
  return env.DB ?? null;
}

export async function verifyAdminAuth(request: Request): Promise<boolean> {
  const env = await getWorkerEnv();
  const expected = env.ADMIN_TOKEN || process.env.ADMIN_TOKEN || "gta8-admin";
  const provided =
    request.headers.get("x-admin-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  return provided.length > 0 && provided === expected;
}
