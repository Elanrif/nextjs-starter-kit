"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "@/lib/auth/models/auth.model";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import { authClient } from "@/lib/auth/wrapper/auth.client";

/**
 * Sign In Form Component
 * Modern design with validation indicators
 */
export function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fillDemo = () => {
    setValue("email", "admin@gmail.com");
    setValue("password", "admin123456");
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if ("error" in result) {
        setError(result.error?.message || "An error occurred during sign in.");
        return;
      }
      router.push("/dashboard");
    } catch (error_: any) {
      setError(error_?.message || "An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="relative">
        <span className="block text-xs font-medium text-gray-300 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
          Adresse email
        </span>
        <div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          style={{ top: "1.5rem" }}
        >
          <Mail className="h-5 w-5 text-gray-50" />
        </div>
        <input
          type="email"
          {...register("email")}
          placeholder="exemple@email.com"
          className="w-full pl-12 pr-4 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-100 placeholder-slate-400 placeholder:text-xs"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <span className="block text-xs font-medium text-gray-300 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
          Mot de passe
        </span>
        <div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          style={{ top: "1.5rem" }}
        >
          <Lock className="h-5 w-5 text-gray-50" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          {...register("password")}
          placeholder="Votre mot de passe"
          disabled={isLoading}
          className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-100 placeholder-slate-400 placeholder:text-xs"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 pr-4 flex items-center text-gray-100 hover:text-gray-100"
          style={{ top: "1.5rem", bottom: 0 }}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-emerald-300 hover:text-emerald-400"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-emerald-600 to-teal-700 text-white font-medium rounded-full hover:from-emerald-400 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-300
        focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center
         justify-center gap-2 shadow-lg shadow-emerald-300/30"
      >
        {isLoading ? (
          "Signing in..."
        ) : (
          <>
            Sign In
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* Social Login */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-gray-50 text-sm">Or</span>
        <div className="flex gap-3">
          {/* clickable person icon to autofill */}
          <div className="hover:bg-blue-700 bg-blue-500 duration-300 text-white flex p-2 rounded-full border items-center gap-2">
            <User onClick={fillDemo} className="size-6" />
          </div>
          <SocialButton icon="facebook" />
          <SocialButton icon="google" />
        </div>
      </div>
    </form>
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
