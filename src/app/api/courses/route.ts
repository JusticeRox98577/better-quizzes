import { NextResponse } from "next/server";
import { requireEnv, env } from "../../../lib/env";
import { getDb } from "../../../lib/mongo";
import { decryptString } from "../../../lib/crypto";
import { canvasListCourses } from "../../../lib/canvas";
import { getConnectionIdFromCookie } from "../_cookies";

export const runtime = "nodejs";

export async function GET() {
  requireEnv();
  const connectionId = getConnectionIdFromCookie();
  if (!connectionId) return NextResponse.json({ error: "Not connected" }, { status: 401 });

  const db = await getDb();
  const conn = await db.collection("connections").findOne({ _id: connectionId });
  if (!conn) return NextResponse.json({ error: "Connection not found" }, { status: 401 });

  const token = await decryptString(String(conn.tokenEnc), env.appSecret);
  const courses = await canvasListCourses(String(conn.canvasBaseUrl), token);
  return NextResponse.json({ courses });
}
