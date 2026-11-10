import type { User } from "./types";

const users = new Map<string, User>();

export function saveUser(user: User): void {
  users.set(user.id, user);
}

export function findUser(id: string): User | undefined {
  return users.get(id);
}
