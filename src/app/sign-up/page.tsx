import Link from "next/link";
import { ArrowLeft, Key } from "lucide-react";
import { ROUTES } from "@/utils/routes";
import { SignUpForm } from "@/components/kickstart/auth/SignUpForm";

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

/**
 * Sign Up Page
 * Modern split-screen layout with decorative right panel
 */
const { HOME, SIGN_IN } = ROUTES;
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col px-0 py-3 sm:px-8 sm:py-6 lg:px-16 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href={HOME}
            className="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="text-sm">
            Already member?{" "}
            <Link
              href={SIGN_IN}
              className="text-emerald-300 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center px-5 sm:ps-20">
          <div className="w-full max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
              <p className="text-gray-50">
                Create your account to get started
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Floating Cards */}
          <div className="absolute top-20 left-16 bg-white rounded-2xl shadow-xl p-5 w-48">
            <p className="text-orange-500 text-sm font-medium">Inbox</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">176,18</p>
            <div className="mt-4 flex items-end gap-1 h-16">
              <div className="w-4 bg-orange-200 rounded-t h-8"></div>
              <div className="w-4 bg-orange-200 rounded-t h-12"></div>
              <div className="w-4 bg-orange-300 rounded-t h-6"></div>
              <div className="w-4 bg-orange-200 rounded-t h-10"></div>
              <div className="w-4 bg-orange-400 rounded-t h-14"></div>
              <div className="w-4 bg-orange-300 rounded-t h-8"></div>
              <div className="w-4 bg-orange-200 rounded-t h-16"></div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="absolute top-16 right-20 w-14 h-14 bg-linear-to-br from-pink-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>

          <div className="absolute top-40 right-12 w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
            </svg>
          </div>

          {/* Data Card */}
          <div className="absolute bottom-32 right-16 bg-white rounded-2xl shadow-xl p-6 w-64">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-2 w-16 bg-blue-500 rounded"></div>
                <div className="h-2 w-24 bg-gray-200 rounded"></div>
                <div className="h-2 w-20 bg-gray-200 rounded"></div>
                <div className="h-2 w-28 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Your data, your rules
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Your data belongs to you, and our encryption ensures that
              </p>
            </div>
          </div>

          {/* Brand */}
          <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="bg-gray-400/30 backdrop-blur-sm rounded-2xl px-8 py-4">
              <span className="text-white text-2xl font-bold">Kickstart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
