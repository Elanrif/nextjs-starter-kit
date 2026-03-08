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
import { User } from "../user/models/user.model";

/**
 * Server Action: Sign In
 * Safely handles authentication on the server side
 */
export async function signInAction(
  credentials: Login,
): Promise<User | CrudApiError> {
  try {
    const res = await serverSignIn(credentials);

    if ("error" in res) {
      const errMsg = crudApiErrorResponse(res, "signUp");
      return errMsg;
    }

    // Create session with user data
    await createSession(res.id, res.email, res.role);

    return res;
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

    if ("error" in res) {
      const errMsg = crudApiErrorResponse(res, "signUp");
      return errMsg;
    }

    // Create session after successful registration
    await createSession(res.id, res.email, res.role);

    return res;
  } catch (error: any) {
    const errMsg = crudApiErrorResponse(error, "register");
    return errMsg;
  }
}
