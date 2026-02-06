import { createSecretKey, randomBytes } from "node:crypto";
import { compactDecrypt, CompactEncrypt } from "jose";

function deriveKey(appSecret: string) {
  const raw = Buffer.alloc(32, 0);
  const src = Buffer.from(appSecret, "utf8");
  src.copy(raw, 0, 0, Math.min(src.length, 32));
  return createSecretKey(raw);
}

export async function encryptString(plaintext: string, appSecret: string): Promise<string> {
  const key = deriveKey(appSecret);
  const iv = randomBytes(12);
  const enc = new CompactEncrypt(Buffer.from(plaintext, "utf8"));
  enc.setProtectedHeader({ alg: "dir", enc: "A256GCM", iv: Buffer.from(iv).toString("base64url") });
  return await enc.encrypt(key);
}

export async function decryptString(ciphertext: string, appSecret: string): Promise<string> {
  const key = deriveKey(appSecret);
  const { plaintext } = await compactDecrypt(ciphertext, key);
  return Buffer.from(plaintext).toString("utf8");
}
