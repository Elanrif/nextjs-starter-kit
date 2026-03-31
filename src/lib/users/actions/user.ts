"use server";

import { deleteUser, updateUser } from "../services/user.client.service";

/*⚠️ We dont use await function, because we are not waiting for the result */

export async function deleteUserAction(id: number) {
  return deleteUser(id);
}

export async function updateUserAction(id: number, data: Record<string, unknown>) {
  return updateUser(id, data);
}
