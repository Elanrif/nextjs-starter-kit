"use server";

import { deleteSession } from "@lib/auth/session";

export async function signOut() {
  await deleteSession();
}
