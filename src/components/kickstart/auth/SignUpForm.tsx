"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Circle,
  ArrowRight,
} from "lucide-react";
import { signUp } from "@/lib/auth/auth.client.service";

/**
 * Password validation rules
 */
function usePasswordValidation(password: string) {
  return useMemo(
    () => ({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password) || /[!"#$%&()*,.:<>?@^{|}]/.test(password),
      hasCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    }),
    [password],
  );
}

/**
 * Sign Up Form Component
 * Modern design with password validation indicators
 */
export function SignUpForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fillDemo = () => {
    setFirstName("Elanrif");
    setLastName("SAID BACO");
    setPhoneNumber("1234567890");
    setEmail("elanrif@gmail.com");
    setPassword("12345678");
    setConfirmPassword("12345678");
  };
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validation = usePasswordValidation(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValid) {
      setError("Invalid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validation.minLength || !validation.hasNumber || !validation.hasCase) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        action: "SIGN_UP",
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });

      if ("statusCode" in result && result.statusCode !== 200) {
        setError(result.message || "Failed to create account");
        return;
      }
      
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <label className="flex items-center gap-4">
        {/* First Name Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Last Name Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </label>

      <label className="flex items-center gap-4">
        {/* Phone Number Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
          />
          {email && isEmailValid && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
          )}
        </div>
      </label>

      <label className="flex items-start gap-4">
        {/* Password Field */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="mt-3 space-y-1.5 text-sm">
              <ValidationItem
                valid={validation.minLength}
                text="Least 8 characters"
              />
              <ValidationItem
                valid={validation.hasNumber}
                text="Least one number (0-9) or a symbol"
              />
              <ValidationItem
                valid={validation.hasCase}
                text="Lowercase (a-z) and uppercase (A-Z)"
              />
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-Type Password"
            required
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-full hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
      >
        {isLoading ? (
          "Creating account..."
        ) : (
          <>
            Sign Up
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* Social Login */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-gray-400 text-sm">Or</span>
        <div className="flex items-center gap-3">
          {/* clickable person icon to autofill */}
          <div className="hover:bg-blue-300 bg-blue-400 duration-300 text-white flex p-2 rounded-full border items-center gap-2">
            <User onClick={fillDemo} className="size-6" />
          </div>
          <SocialButton icon="facebook" />
          <SocialButton icon="google" />
        </div>
      </div>
    </form>
  );
}

function ValidationItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 text-gray-300" />
      )}
      <span className={valid ? "text-emerald-600" : "text-gray-400"}>
        {text}
      </span>
    </div>
  );
}

function SocialButton({ icon }: { icon: "facebook" | "google" }) {
  return (
    <button
      type="button"
      className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
    >
      {icon === "facebook" ? (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
    </button>
  );
}
