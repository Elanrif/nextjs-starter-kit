"use server";

import {
  changePasswordProfile,
  editProfile,
  resetPassword,
  signIn as serverSignIn,
  signUp as serverSignUp,
} from "@/lib/auth/services/auth.server";
import { Login, Registrer } from "@/lib/auth/models/auth.model";
import { ChangePasswordProfileFormData, ProfileUserFormData } from "@/lib/auth/schemas/auth.schema";
import { ResetPassword } from "@/lib/users/models/user.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";
import { generateResetToken, sendPasswordResetEmail } from "@/lib/mail";
import environment from "@/config/environment.config";

export async function signInAction(credentials: Login) {
  return serverSignIn(credentials);
}

export async function signUpAction(userData: Registrer) {
  return serverSignUp(userData);
}

export async function editProfileAction(data: ProfileUserFormData) {
  return editProfile(data);
}

export async function sendPasswordResetAction(
  email: string,
): Promise<{ success: boolean; message: string } | ApiError> {
  try {
    // Check if email is valid
    if (!email || !email.includes("@")) {
      return {
        title: "Invalid email",
        status: 400,
        detail: "Please provide a valid email address",
        instance: undefined,
        errorCode: "INVALID_EMAIL",
      } as ApiError;
    }

    // Generate reset token
    const { resetToken, code } = generateResetToken();
    const baseUrl = environment.app.url;
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&code=${code}&email=${encodeURIComponent(email)}`;

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

    if (!emailSent) {
      return {
        title: "Email service unavailable",
        status: 503,
        detail: "Failed to send reset email. Please try again later.",
        instance: undefined,
        errorCode: "EMAIL_SERVICE_UNAVAILABLE",
      } as ApiError;
    }

    // Always return success message for security (don't reveal if email exists)
    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "sendPasswordReset action");
    return errMsg;
  }
}

export async function resetPasswordTokenAction(data: ResetPassword) {
  return resetPassword(data);
}

export async function changePasswordProfileAction(data: ChangePasswordProfileFormData) {
  return await changePasswordProfile(data);
}
