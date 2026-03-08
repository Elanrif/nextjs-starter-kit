"use client";

import { useState } from "react";
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
  Phone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, RegisterSchema } from "@/lib/auth/models/auth.model";
import { signUpAction } from "@/lib/actions/auth";

/**
 * Password validation rules
 */
function usePasswordValidation(password: string) {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password) || /[!"#$%&()*,.:<>?@^{|}]/.test(password),
    hasCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };
}

/**
 * Sign Up Form Component
 * Modern design with password validation indicators
 */
export function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validation = usePasswordValidation(password);

  const fillDemo = () => {
    setValue("firstName", "Elanrif");
    setValue("lastName", "SAID BACO");
    setValue("phoneNumber", "1234567890");
    setValue("email", "elanrif@gmail.com");
    setValue("password", "Demo1234");
    setValue("confirmPassword", "Demo1234");
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUpAction({
        action: "SIGN_UP",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      });

      if ("error" in result) {
        setError(result.message || "Failed to create account");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error_: any) {
      setError(error_?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <label className="flex flex-col sm:flex-row sm:items-center gap-10">
        {/* First Name Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5" />
          </div>
          <input
            type="text"
            {...register("firstName")}
            placeholder="First Name"
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300
             focus:outline-none transition-colors bg-transparent text-gray-50 placeholder-gray-50"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">
              {errors.firstName.message}
            </span>
          )}
        </div>

        {/* Last Name Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5" />
          </div>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Last Name"
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-50 placeholder-gray-50"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </label>

      <label className="flex flex-col sm:flex-row sm:items-center gap-10">
        {/* Phone Number Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Phone className="h-5 w-5" />
          </div>
          <input
            type="tel"
            {...register("phoneNumber")}
            placeholder="Phone Number"
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-50 placeholder-gray-50"
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">
              {errors.phoneNumber.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5" />
          </div>
          <input
            type="email"
            {...register("email")}
            placeholder="Email Address"
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-50 placeholder-gray-50"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
      </label>

      <label className="flex flex-col sm:flex-row sm:items-center gap-10">
        {/* Password Field */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-50 placeholder-gray-50"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
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
            <Lock className="h-5 w-5" />
          </div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Re-Type Password"
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-50 placeholder-gray-50"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-emerald-600 to-teal-700 text-white font-medium rounded-full hover:from-emerald-400 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 
        focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center
         justify-center gap-2 shadow-lg shadow-emerald-300/30"
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
        <span className="text-sm">Or</span>
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
      className="w-11 h-11 rounded-full border border-gray-200
       flex items-center justify-center hover:bg-gray-100 bg-white/80 transition-colors"
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
