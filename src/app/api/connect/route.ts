import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireEnv, env, normalizeCanvasBaseUrl } from "@/lib/env";
import { encryptString } from "@/lib/crypto";
import { getDb } from "@/lib/mongo";
import { canvasGetSelf } from "@/lib/canvas";
import { setConnectionCookie } from "../_cookies";

export const runtime = "nodejs";

export async function POST(req: Request) {
  requireEnv();
  const body = await req.json().catch(() => null) as any;
  const canvasBaseUrl = normalizeCanvasBaseUrl(body?.canvasBaseUrl ?? "");
  const token = String(body?.token ?? "").trim();
  if (!canvasBaseUrl || !token) return NextResponse.json({ error: "Missing canvasBaseUrl or token" }, { status: 400 });

  const self = await canvasGetSelf(canvasBaseUrl, token);
  const connectionId = nanoid(32);
  const tokenEnc = await encryptString(token, env.appSecret);

  const db = await getDb();
  await db.collection("connections").insertOne({ _id: connectionId, createdAt: new Date(), canvasBaseUrl, tokenEnc, canvasUserId: self.id, canvasUserName: self.name });

  setConnectionCookie(connectionId);
  return NextResponse.json({ ok: true, user: self });
}
