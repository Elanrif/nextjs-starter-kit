"use server";

import {
  signIn as serverSignIn,
  signUp as serverSignUp,
} from "@/lib/auth/auth.service";
import { createSession } from "@/lib/auth/session";
import {
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";
import { Login, Registrer } from "@/lib/auth/models/auth.model";
import { ResetPassword, User } from "@/lib/user/models/user.model";
import {
  sendPasswordResetEmail,
  generateResetToken,
} from "@/config/mail.config";
import { resetPassword } from "@/lib/user/services/user.service";

/**
 * Server Action: Sign In
 * Safely handles authentication on the server side
 */
export async function signInAction(
  credentials: Login,
): Promise<User | CrudApiError> {
  try {
    const res = await serverSignIn(credentials);

    if (!res.ok) {
      const errMsg = crudApiErrorResponse(res, "signUp");
      return errMsg;
    }

    // Create session with user data
    await createSession(res.data.id, res.data.email, res.data.role);

    return res.data;
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "register");
    return errMsg;
  }
}

/**
 * Server Action: Sign Up
 * Safely handles user registration on the server side
 */
export async function signUpAction(
  userData: Registrer,
): Promise<User | CrudApiError> {
  try {
    const res = await serverSignUp(userData);

    if (!res.ok) {
      const errMsg = crudApiErrorResponse(res, "signUp");
      return errMsg;
    }

    // Create session after successful registration
    await createSession(res.data.id, res.data.email, res.data.role);

    return res.data;
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "register");
    return errMsg;
  }
}

/**
 * Server Action: Send Password Reset Email
 * Generates token and sends reset email to user
 */
export async function sendPasswordResetAction(
  email: string,
): Promise<{ success: boolean; message: string } | CrudApiError> {
  try {
    // Check if email is valid
    if (!email || !email.includes("@")) {
      return {
        error: "Invalid email",
        status: 400,
        message: "Please provide a valid email address",
      } as CrudApiError;
    }

    // Generate reset token
    const resetToken = generateResetToken();

    // In production, store this token in database with expiration time (1 hour)
    // For now, we'll just log it
    console.log(`[DEV] Reset token for ${email}: ${resetToken}`);

    // Build reset URL (adjust based on your domain)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

    if (!emailSent) {
      return {
        error: "Email service unavailable",
        status: 503,
        message: "Failed to send reset email. Please try again later.",
      } as CrudApiError;
    }

    // Always return success message for security (don't reveal if email exists)
    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "sendPasswordReset");
    return errMsg;
  }
}

/**
 * Server Action: Change Password
 * Safely handles password change on the server side
 * Requires current password for security
 */
export async function resetPasswordTokenAction(
  data: ResetPassword,
): Promise<User | CrudApiError> {
  if (!data.token) {
    return {
      error: "Token required",
      status: 400,
      message: "Password reset token is required",
    } as CrudApiError;
  }

  try {
    const res = await resetPassword(data);

    if (!res.ok) {
      const errMsg = crudApiErrorResponse(res, "resetPassword");
      return errMsg;
    }

    // Create session after successful password change
    await createSession(res.data.id, res.data.email, res.data.role);

    return res.data;
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "resetPassword");
    return errMsg;
  }
}

/**
 * Server Action: Reset Password with Token
 * Resets user password using token from email link
 */
export async function resetPasswordWithTokenAction(
  email: string,
  token: string,
  newPassword: string,
): Promise<{ success: boolean; message: string } | CrudApiError> {
  try {
    // Validate inputs
    if (!email || !token || !newPassword) {
      return {
        error: "Invalid request",
        status: 400,
        message: "Missing required fields",
      } as CrudApiError;
    }

    if (newPassword.length < 8) {
      return {
        error: "Weak password",
        status: 400,
        message: "Password must be at least 8 characters",
      } as CrudApiError;
    }

    // TODO: In production, validate token against database
    // - Check if token exists for this email
    // - Check if token is not expired
    // - Mark token as used
    console.log(`[DEV] Reset password with token: ${token} for ${email}`);

    // Call backend with correct data structure
    const resetPasswordData: ResetPassword = {
      token, // just uses token for validation in backend, oldPassword is not needed for token-based reset
      email,
      newPassword,
      oldPassword: "", // Not needed for token-based reset
    };

    const res = await resetPassword(resetPasswordData);

    if (!res.ok) {
      const errMsg = crudApiErrorResponse(res, "resetPasswordWithToken");
      return errMsg;
    }

    // Create session after successful password change
    await createSession(res.data.id, res.data.email, res.data.role);

    return {
      success: true,
      message:
        "Password reset successfully. You can now sign in with your new password.",
    };
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "resetPasswordWithToken");
    return errMsg;
  }
}
