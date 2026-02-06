import { cookies } from "next/headers";
export const CONNECTION_COOKIE = "bq_conn";
export function getConnectionIdFromCookie(): string | null { return cookies().get(CONNECTION_COOKIE)?.value ?? null; }
export function setConnectionCookie(value: string) {
  cookies().set(CONNECTION_COOKIE, value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}
