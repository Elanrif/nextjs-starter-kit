import { getLogger } from "@config/logger.config";
import { UserUpdate } from "@lib/user/models/user.model";
import { updateUser } from "@lib/user/services/user.client.service";

const logger = getLogger();

export async function updateUserAction(user: UserUpdate) {
  try {
    return await updateUser(user);
  } catch (error) {
    logger.debug("Update user failed", { error });
    return;
  }
}
