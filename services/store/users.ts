import { readCollection, writeCollection } from "./db";
import type { User } from "@/types/user";
import { hashPassword, serializeHash, verifyPassword, parseHash } from "@/lib/auth/password";

interface StoredUser extends Omit<User, "password"> {
  passwordHash: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  campus: string;
  faculty: string;
  department: string;
  level: string;
}

export interface PublicUser extends User {
  id: string;
}

function toPublicUser(stored: StoredUser): PublicUser {
  const rest = { ...stored } as Partial<StoredUser>;
  delete rest.passwordHash;
  return rest as PublicUser;
}

export async function listUsers(): Promise<StoredUser[]> {
  return readCollection<StoredUser>("users", []);
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await listUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  const users = await listUsers();
  const existing = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (existing) throw new Error("USER_EXISTS");

  const stored: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(input.firstName + " " + input.lastName)}&backgroundColor=0ea5e9`,
    campus: input.campus,
    faculty: input.faculty,
    department: input.department,
    level: input.level,
    joinedAt: new Date().toISOString(),
    verifiedStudent: true,
    passwordHash: serializeHash(hashPassword(input.password)),
  };

  await writeCollection("users", [...users, stored]);
  return toPublicUser(stored);
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const valid = verifyPassword(password, parseHash(user.passwordHash));
  return valid ? toPublicUser(user) : null;
}
