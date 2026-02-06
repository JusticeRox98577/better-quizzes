export const env = {
  mongoUrl: process.env.MONGO_URL ?? "",
  appSecret: process.env.APP_SECRET ?? "",
  appUrl: (process.env.APP_URL ?? "").replace(/\/+$/, "")
};

export function requireEnv() {
  const missing = Object.entries(env).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);
}

export function normalizeCanvasBaseUrl(input: string): string {
  const v = input.trim();
  if (!v) return v;
  const url = v.startsWith("http") ? v : `https://${v}`;
  return url.replace(/\/+$/, "");
}
