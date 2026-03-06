import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { ROUTES } from "@/utils/routes";
import { SignInForm } from "@/components/kickstart/auth/SignInForm";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

/**
 * Sign In Page
 * Modern split-screen layout with decorative right panel
 */
const { HOME, SIGN_UP } = ROUTES;
export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col px-8 py-6 lg:px-16 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href={HOME}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={SIGN_UP}
              className="text-emerald-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center ps-20">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500">
                Sign in to continue to your account
              </p>
            </div>

            <SignInForm />
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Stats Card */}
          <div className="absolute top-20 left-16 bg-white rounded-2xl shadow-xl p-5 w-48">
            <p className="text-emerald-500 text-sm font-medium">Welcome back</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">2,847</p>
            <p className="text-sm text-gray-500 mt-1">Active sessions</p>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            </div>
          </div>

          {/* Security Icon */}
          <div className="absolute top-16 right-20 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-emerald-500" />
          </div>

          <div className="absolute top-40 right-12 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          {/* Security Card */}
          <div className="absolute bottom-32 right-16 bg-white rounded-2xl shadow-xl p-6 w-64">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-2 w-16 bg-emerald-500 rounded"></div>
                <div className="h-2 w-24 bg-gray-200 rounded"></div>
                <div className="h-2 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">Secure Access</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your account is protected with enterprise-grade security
              </p>
            </div>
          </div>

          {/* Brand */}
          <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
              <span className="text-white text-2xl font-bold">Kickstart</span>
            </div>
          </div>

          {/* Floating circles */}
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
