"use server";

import { revalidatePath } from "next/cache";
import { deleteUser, updateUser, createUser } from "../services/user.client.service";

/*⚠️ We dont use await function, because we are not waiting for the result */

export async function createUserAction(data: Record<string, unknown>) {
  const result = await createUser(data as Omit<any, "id">);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}

export async function updateUserAction(id: number, data: Record<string, unknown>) {
  const result = await updateUser(id, data);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}

export async function deleteUserAction(id: number) {
  const result = await deleteUser(id);
  if (result.ok) {
    revalidatePath("/users");
  }
  return result;
}
