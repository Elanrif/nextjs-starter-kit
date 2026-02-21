import { useMutation } from "@tanstack/react-query";
import { User } from "@lib/user/models/user.model";
import { updateUserAction } from "./customer-actions";
import { getLogger } from "@config/logger.config";

const logger = getLogger();

export interface UpdateUserType {
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  shareProfileData: boolean;
  setAdsPerformance: boolean;
}

export type UpdateUser = Partial<User> & {
  password?: string;
  confirmPassword?: string;
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: (input: UpdateUser) => updateUserAction(input),
    onSuccess: (data) => {
      logger.debug("UpdateUser success response", { data });
    },
    onError: (error) => {
      logger.debug("Update user mutation failed", { error });
    },
  });
};
