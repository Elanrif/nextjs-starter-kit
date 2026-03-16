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
import {
  User as UserIcon,
  Mail,
  Plus,
  Phone,
  Edit,
  ArrowLeft,
} from "lucide-react";
import {
  ProfileUserFormData,
  ProfileUserSchema,
} from "@/lib/auth/models/auth.model";
import { editProfileAction } from "@/lib/actions/auth";
import { DashboardButton } from "../../dashboard/DashboardButton";

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
