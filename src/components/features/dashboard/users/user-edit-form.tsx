"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "@/components/features/loading";
import { ROUTES } from "@/utils/routes";
import { Card } from "@/components/ui/card";
import { User, UserFormData, UserSchema } from "@/lib/users/models/user.model";
import { updateUser } from "@/lib/users/services/user.client.service";
import { usePasswordValidation } from "@/hooks/use-password-validation";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Phone,
  ArrowLeft,
  PlusIcon,
} from "lucide-react";
import ValidationItem from "@/components/ui/validation-item";
import { DashboardButton } from "../dashboard-button";

const { DASHBOARD, USERS } = ROUTES;

export function UserEditForm({ loadedUser }: { loadedUser: User | null }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema) as any,
    defaultValues: {
      firstName: loadedUser?.firstName || "",
      lastName: loadedUser?.lastName || "",
      email: loadedUser?.email || "",
      phoneNumber: loadedUser?.phoneNumber || "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = usePasswordValidation(password);

  /**
   * Handles user update with robust error management.
   * Uses try/catch/finally to catch unexpected errors (e.g., JS crash, network issues, etc.)
   * and ensures loading is always stopped, even if an exception occurs.
   */
  const onSubmit = async (data: UserFormData) => {
    if (!loadedUser) {
      setError("User data is not loaded");
      toast.error("User data is not loaded");
      return;
    }
    setLoading(true);
    try {
      const response = await updateUser(Number(loadedUser.id), data);

      if (!response.ok) {
        setError(response.error.message || "Erreur lors de la mise à jour");
        toast.error(response.error.message || "Erreur lors de la mise à jour");
        return;
      }

      toast.success("Utilisateur mis à jour avec succès !");
      router.push(`${DASHBOARD}${USERS}`);
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier un utilisateur
              </h1>
              <p className="text-sm text-gray-7000">
                Mettre à jour les informations d&apos;un utilisateur existant
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
                  <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                    Prénom
                  </span>
                  <div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    style={{ top: "1.5rem" }}
                  >
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="Votre prénom"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300
             focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-slate-400 placeholder:text-xs"
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="relative">
                  <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                    Nom
                  </span>
                  <div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    style={{ top: "1.5rem" }}
                  >
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="Votre nom"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-slate-400 placeholder:text-xs"
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
                  <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                    Numéro de téléphone
                  </span>
                  <div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    style={{ top: "1.5rem" }}
                  >
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    {...register("phoneNumber")}
                    placeholder="+33 6 00 00 00 00"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-slate-400 placeholder:text-xs"
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm">
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                    Adresse email
                  </span>
                  <div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    style={{ top: "1.5rem" }}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="exemple@email.com"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-slate-400 placeholder:text-xs"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </label>

              <label className="flex flex-col sm:flex-row items-start gap-10">
                {/* Password Field */}
                <div>
                  <div className="relative">
                    <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                      Mot de passe
                    </span>
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ top: "1.5rem" }}
                    >
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Votre mot de passe"
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-slate-400 placeholder:text-xs"
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
                  <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                    Confirmer le mot de passe
                  </span>
                  <div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    style={{ top: "1.5rem" }}
                  >
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Répétez le mot de passe"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b border-gray-200 focus:border-emerald-300 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-slate-400 placeholder:text-xs"
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t-2 border-orange-100">
                <DashboardButton
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  {loading ? "en cours..." : "Modifier"}
                </DashboardButton>
                <DashboardButton
                  type="button"
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Annuler
                </DashboardButton>{" "}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
