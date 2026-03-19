"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "@/components/features/loading";
import { ROUTES } from "@/utils/routes";
import { Card } from "@/components/ui/card";
import { usePasswordValidation } from "@/hooks/use-password-validation";
import { Lock, Eye, EyeOff, Plus, Edit, ArrowLeft } from "lucide-react";
import ValidationItem from "@/components/ui/validation-item";
import {
  ChangePasswordProfileFormData,
  ChangePasswordProfileSchema,
} from "@/lib/auth/models/auth.model";
import { useAuthUser } from "@/lib/auth/context/auth.user.context";
import { changePasswordProfileAction } from "@/lib/auth/actions/auth";
import { DashboardButton } from "../dashboard/dashboard-button";
import { authClient } from "@/lib/auth/api/auth.client.service";

const { MY_ACCOUNT } = ROUTES;

export function ChangePassword() {
  const router = useRouter();

  const user = useAuthUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordProfileFormData>({
    resolver: zodResolver(ChangePasswordProfileSchema) as any,
    defaultValues: {
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const password = watch("newPassword");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = usePasswordValidation(password);

  /**
   * Handles user update with robust error management.
   * Uses try/catch/finally to catch unexpected errors (e.g., JS crash, network issues, etc.)
   * and ensures loading is always stopped, even if an exception occurs.
   */
  const onSubmit = async (data: ChangePasswordProfileFormData) => {
    if (!user) {
      setError("User data is not loaded");
      toast.error("User data is not loaded");
      return;
    }
    setLoading(true);
    try {
      const response = await changePasswordProfileAction(data);

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

  if (!user)
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-gray-500 text-lg">
            Erreur 403: Aucune session active.
          </p>
        </Card>
      </div>
    );

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
                Changer mon mot de passe
              </h1>
              <p className="text-sm text-gray-7000">
                Mettez à jour votre mot de passe pour sécuriser votre compte
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

              <label className="flex flex-col sm:flex-row items-start gap-10">
                {/* Password Field */}
                <div>
                  <div className="relative">
                    <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                      Ancien mot de passe
                    </span>
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ top: "1.5rem" }}
                    >
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      {...register("oldPassword")}
                      placeholder="Votre mot de passe actuel"
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3.5 border-b-2 border-gray-400 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-500 placeholder:text-xs"
                    />
                    {errors.oldPassword && (
                      <span className="text-red-500 text-sm">
                        {errors.oldPassword.message}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </label>

              <label className="flex flex-col sm:flex-row items-start gap-10">
                {/* Password Field */}
                <div>
                  <div className="relative">
                    <span className="block text-xs font-medium text-gray-500 mb-1 pl-1 after:content-['*'] after:text-red-500 after:ml-1.5">
                      Nouveau mot de passe
                    </span>
                    <div
                      className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                      style={{ top: "1.5rem" }}
                    >
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("newPassword")}
                      placeholder="Nouveau mot de passe"
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3.5 border-b-2 border-gray-400 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-500 placeholder:text-xs"
                    />
                    {errors.newPassword && (
                      <span className="text-red-500 text-sm">
                        {errors.newPassword.message}
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
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Répétez le nouveau mot de passe"
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3.5 border-b-2 border-gray-400 focus:border-emerald-500 focus:outline-none transition-colors bg-transparent text-gray-700 placeholder-gray-500 placeholder:text-xs"
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </label>

              {/* Forgot Password Link */}
              <div
                className="text-left hover:cursor-pointer text-sm text-blue-700 hover:text-blue-600"
                onClick={() => {
                  setLoading(true);
                  authClient
                    .signOut()
                    .then(() => {
                      router.push(ROUTES.FORGOT_PASSWORD);
                      setLoading(false);
                    })
                    .catch((error) => {
                      toast.error(
                        "Erreur lors de la déconnexion",
                        error.message,
                      );
                      setLoading(false);
                    });
                }}
              >
                Mot de passe oublié ?
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t-2 border-orange-100">
                <DashboardButton
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {loading ? "en cours..." : "Enregistrer"}
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
                </DashboardButton>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
