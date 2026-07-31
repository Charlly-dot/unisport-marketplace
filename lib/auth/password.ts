import { createHash, randomBytes, timingSafeEqual } from "crypto";

export interface PasswordHash {
  salt: string;
  hash: string;
}

function derive(salt: string, password: string): string {
  return createHash("sha256")
    .update(salt + password)
    .digest("hex");
}

export function hashPassword(password: string): PasswordHash {
  const salt = randomBytes(16).toString("hex");
  return { salt, hash: derive(salt, password) };
}

export function verifyPassword(password: string, stored: PasswordHash): boolean {
  const candidate = derive(stored.salt, password);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(stored.hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function serializeHash(ph: PasswordHash): string {
  return `${ph.salt}:${ph.hash}`;
}

export function parseHash(raw: string): PasswordHash {
  const [salt, hash] = raw.split(":");
  return { salt, hash };
}
