"use server";

import {
  changePasswordProfile,
  editProfile,
  resetPassword,
  signIn as serverSignIn,
  signUp as serverSignUp,
} from "@/lib/auth/auth.service";
import {
  ChangePasswordProfileFormData,
  Login,
  parseChangePasswordProfile,
  ProfileUserFormData,
  Registrer,
} from "@/lib/auth/models/auth.model";
import { parseResetPassword, ResetPassword, User } from "@/lib/users/models/user.model";
import { sendPasswordResetEmail, generateResetToken } from "@/config/mail.config";
import { deleteSession } from "@lib/auth/jose";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";

/**
 * Server Action: Sign In
 * Safely handles authentication on the server side
 */
export async function signInAction(credentials: Login): Promise<User | ApiError> {
  try {
    const res = await serverSignIn(credentials);

    if (!res.ok) {
      return res.error;
    }

    return res.data;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "signIn action");
    return errMsg;
  }
}

/**
 * Server Action: Sign Up
 * Safely handles user registration on the server side
 */
export async function signUpAction(userData: Registrer): Promise<User | ApiError> {
  try {
    const res = await serverSignUp(userData);

    if (!res.ok) {
      return res.error;
    }

    return res.data;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "signUp action");
    return errMsg;
  }
}

/**
 * Server Action: Edit Profile
 * Safely handles profile editing on the server side
 */
export async function editProfileAction(data: ProfileUserFormData): Promise<User | ApiError> {
  try {
    const res = await editProfile(data);

    if (!res.ok) {
      return res.error;
    }
    return res.data;
  } catch (error: any) {
    const errMsg = ApiErrorResponse(error, "editProfile action");
    return errMsg;
  }
}

/**
 * Server Action: Send Password Reset Email
 * Generates token and sends reset email to user
 */
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

    // Build reset URL (adjust based on your domain)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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

/**
 * Server Action: Change Password
 * Safely handles password change on the server side
 * Requires current password for security
 */
export async function resetPasswordTokenAction(data: ResetPassword): Promise<User | ApiError> {
  const validation = parseResetPassword(data);
  if (!validation.success) {
    return {
      status: 400,
      detail: validation.error.message,
      title: "Bad Request",
      instance: undefined,
      errorCode: "VALIDATION_ERROR",
    } as ApiError;
  }

  try {
    const res = await resetPassword(data);

    if (!res.ok) {
      return res.error;
    }

    // Go to sign in page after successful password reset
    return res.data;
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "error resetPassword action");
    return errMsg;
  }
}

/**
 * Server Action: Change Password
 * Safely handles password change on the server side for authenticated users
 * Requires old password for security
 */
export async function changePasswordProfileAction(
  data: ChangePasswordProfileFormData,
): Promise<User | ApiError> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) {
    return {
      status: 400,
      detail: validation.error.message,
      title: "Bad Request",
      instance: undefined,
      errorCode: "VALIDATION_ERROR",
    } as ApiError;
  }

  try {
    const res = await changePasswordProfile(data);

    if (!res.ok) {
      return res.error;
    }

    // Go to sign in page after successful password reset
    return res.data;
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "error changePasswordProfile action");
    return errMsg;
  }
}

/**
 * Delete session cookie to log out user
 */
export async function signOutAction() {
  await deleteSession();
}
