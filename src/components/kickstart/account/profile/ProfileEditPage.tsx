"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "@/components/kickstart/loading-page";
import { ROUTES } from "@/utils/routes";
import { Card } from "@/components/ui/card";
import { User } from "@/lib/user/models/user.model";
import { User as UserIcon, Mail, Plus, ArrowRight, Phone } from "lucide-react";
import {
  ProfileUserFormData,
  ProfileUserSchema,
} from "@/lib/auth/models/auth.model";
import { editProfileAction } from "@/lib/actions/auth";

const { MY_ACCOUNT } = ROUTES;

export function ProfileEditPage({ loadedUser }: { loadedUser: User }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUserFormData>({
    resolver: zodResolver(ProfileUserSchema) as any,
    defaultValues: {
      firstName: loadedUser?.firstName || "",
      lastName: loadedUser?.lastName || "",
      email: loadedUser?.email || "",
      phoneNumber: loadedUser?.phoneNumber || "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles user update with robust error management.
   * Uses try/catch/finally to catch unexpected errors (e.g., JS crash, network issues, etc.)
   * and ensures loading is always stopped, even if an exception occurs.
   */
  const onSubmit = async (data: ProfileUserFormData) => {
    if (!loadedUser) {
      setError("User data is not loaded");
      toast.error("User data is not loaded");
      return;
    }
    setLoading(true);
    try {
      const response = await editProfileAction(data);

      if ("error" in response) {
        setError(response.error.message || "Erreur lors de la mise à jour");
        toast.error(response.error.message || "Erreur lors de la mise à jour");
        return;
      }

      toast.success("Utilisateur mis à jour avec succès !");
      router.push(`${MY_ACCOUNT}`);
    } catch (error_: any) {
      setError(error_.message || "Erreur inattendue lors de la mise à jour");
      toast.error("Erreur inattendue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingPage isLoading={loading} text="Mise à jour de l'utilisateur..." />
      <div className="min-h-[50vh] bg-linear-to-br p-16 from-gray-50 to-gray-100">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier mon profil
              </h1>
              <p className="text-sm text-gray-7000">
                Mettre à jour les informations de mon profil
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="p-8 space-y-8 bg-linear-to-br from-gray-50 to-gray-100">
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
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="First Name"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300
             focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-700"
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
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Last Name"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-700"
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
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-700"
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
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-700"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-emerald-600 to-teal-700 text-white font-medium rounded-full hover:from-emerald-400 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 
        focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center
         justify-center gap-2 shadow-lg shadow-emerald-300/30"
              >
                {loading ? (
                  "Updating account..."
                ) : (
                  <>
                    Valider
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
