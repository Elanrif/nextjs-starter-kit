/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import { CurrentUser, Session } from "@lib/auth/models/auth.model";
import { proxyEnvironment } from "@/config/proxy-api.config";
import { AxiosResponse } from "axios";
import { frontendHttp } from "@/config/axios/frontend-http.config";
import { Result } from "@/shared/models/response.model";
import { ApiError } from "@/shared/errors/api-error";

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

export async function getSession(): Promise<Result<Session, ApiError>> {
  const response = await frontendHttp().get<any, AxiosResponse<Result<Session, ApiError>>>(
    sessionUrl,
  );
  // data is the type of AxiosResponse's data
  return response.data;
}

export async function getCurrentUser(): Promise<Result<CurrentUser, ApiError>> {
  const response = await frontendHttp().get<any, AxiosResponse<Result<CurrentUser, ApiError>>>(
    meUrl,
  );
  // data is the type of AxiosResponse's data
  return response.data;
}
