"use server";

import {
  changePasswordProfile,
  editProfile,
  resetPassword,
  signIn as serverSignIn,
  signUp as serverSignUp,
} from "@/lib/auth/auth.service";
import { Login, Registrer } from "@/lib/auth/models/auth.model";
import { ChangePasswordProfileFormData, ProfileUserFormData } from "@/lib/auth/schemas/auth.schema";
import { ResetPassword } from "@/lib/users/models/user.model";
import { sendPasswordResetEmail, generateResetToken } from "@/config/mail.config";
import { createSession, deleteSession } from "@lib/auth/jose/session.server";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";
import { revalidatePath } from "next/cache";

/*⚠️ We dont use await function, because we are not waiting for the result */

export async function signInAction(credentials: Login) {
  return serverSignIn(credentials);
}

export async function signUpAction(userData: Registrer) {
  return serverSignUp(userData);
}

export async function editProfileAction(data: ProfileUserFormData) {
  const result = await editProfile(data);
  if (result.ok) {
    await createSession(result.data);
    revalidatePath("/account");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function sendPasswordResetAction(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return {
        title: "Invalid email",
        status: 400,
        detail: "Please provide a valid email address",
        instance: undefined,
        errorCode: "INVALID_EMAIL",
      } as ApiError;
    }

    const { resetToken, code } = generateResetToken();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&code=${code}&email=${encodeURIComponent(email)}`;

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

    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: any) {
    return ApiErrorResponse(error, "sendPasswordReset action");
  }
}

export async function resetPasswordTokenAction(data: ResetPassword) {
  return resetPassword(data);
}

export async function changePasswordProfileAction(data: ChangePasswordProfileFormData) {
  return changePasswordProfile(data);
}

export async function signOutAction() {
  await deleteSession();
}
