/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import { Session } from "@lib/auth/models/auth.model";
import { proxyEnvironment } from "@/config/proxy-api.config";
import { AxiosResponse } from "axios";
import { frontendHttp } from "@/config/axios/frontend-http.config";
import { User } from "@/lib/user/models/user.model";

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Auth client service for handling user authentication operations.
 * This service interacts with the proxy API endpoints for authentication.
 */
const {
  api: {
    endpoints: { signOut: _signOutUrl, session: sessionUrl, me: meUrl },
  },
} = proxyEnvironment;

export async function getSession(): Promise<Session | CrudApiError> {
  const result = await frontendHttp().get<any, AxiosResponse<Session>>(
    sessionUrl,
  );
  return result.data;
}

export async function getUserVerifiedSession(): Promise<User | CrudApiError> {
  const result = await frontendHttp().get<any, AxiosResponse<User>>(meUrl);
  return result.data;
}
