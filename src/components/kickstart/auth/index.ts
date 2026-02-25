/**
 * Auth Components
 *
 * Re-export all authentication-related components for easy importing.
 *
 * @example
 * ```tsx
 * import { SignInForm, SignUpForm, SignOutButton, UserSession } from "@/components/auth";
 * ```
 */

// UI Components
export { SignInForm } from "./SignInForm";
export { SignUpForm } from "./SignUpForm";
export { SignOutButton } from "./SignOutButton";
export { UserSession, UserAvatar } from "./UserSession";

// Hooks (for Client Components)
export { useClientSession } from "./useClientSession";
