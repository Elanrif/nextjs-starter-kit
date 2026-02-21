import { getLogger } from "@config/logger.config";
import { useMutation } from "@tanstack/react-query";
import { changeUserPassword } from "@lib/user/services/auth.client.service";

const logger = getLogger();

export interface ChangePasswordInputType {
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInputType) => changeUserPassword(input),
    onSuccess: () => {
      logger.debug("Password changed successfully");
    },
    onError: (error) => {
      logger.debug("Change password mutation failed", { error });
    },
  });
};
