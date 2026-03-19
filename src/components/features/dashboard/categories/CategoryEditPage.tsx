"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardButton } from "@/components/features/dashboard/DashboardButton";
import { toast } from "react-toastify";
import {
  fetchCategory,
  updateCategory,
} from "@/lib/categories/services/category.client.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils/routes";
import LoadingPage from "@/components/features/loading-page";
import {
  CategoryFormData,
  categorySchema,
} from "@/lib/categories/models/category.model";
import { Card } from "@/components/ui/card";
import { Edit, ArrowLeft, Tag } from "lucide-react";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryEditPage({ id }: { id: string }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
      sortOrder: undefined,
    },
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategory(Number(id)).then((res) => {
      if ("id" in res) {
        reset({
          name: res.name || "",
          slug: res.slug || "",
          description: res.description || "",
          imageUrl: (res as any).imageUrl || "",
          isActive: res.isActive ?? true,
          sortOrder: (res as any).sortOrder,
        });
      }
      setLoading(false);
    });
  }, [id, reset]);

  /**
   * Handles category update with robust error management.
   * Uses try/catch/finally to catch unexpected errors (e.g., JS crash, network issues, etc.)
   * and ensures loading is always stopped, even if an exception occurs.
   */
  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const anyRes = (await updateCategory(Number(id), data)) as any;
      const updatedId = anyRes?.id ?? anyRes?.data?.id ?? anyRes?.result?.id;
      if (updatedId) {
        toast.success("Catégorie modifiée avec succès");
        router.push(`${DASHBOARD}${CATEGORIES}/${updatedId}`);
        return;
      }
      if (anyRes && anyRes.message && Array.isArray(anyRes.message.details)) {
        for (const d of anyRes.message.details) {
          if (d.field)
            setError(d.field as keyof CategoryFormData, {
              type: "server",
              message: d.message,
            });
        }
        toast.error("Erreur de validation côté serveur");
        return;
      }
      toast.error(
        anyRes?.message?.message ||
          anyRes?.message ||
          "Erreur lors de la modification",
      );
    } catch (error: any) {
      toast.error(error.message || "Unexpected error during category update");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <LoadingPage isLoading={true} text="Chargement de la catégorie..." />
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Edit className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier la catégorie
            </h1>
            <p className="text-sm text-gray-500">
              Mettre à jour les informations
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 space-y-6 bg-linear-to-br from-gray-50 to-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Info Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-sky-200">
                <Tag className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Informations de la catégorie
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                    Nom
                  </span>
                  <input
                    {...register("name")}
                    placeholder="Ex: Électronique"
                    className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                    Slug
                  </span>
                  <input
                    {...register("slug")}
                    placeholder="Ex: electronique"
                    className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                  />
                  {errors.slug && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.slug.message}
                    </span>
                  )}
                </label>
              </div>

              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </span>
                <textarea
                  {...register("description")}
                  placeholder="Décrivez cette catégorie..."
                  rows={4}
                  className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition placeholder-slate-400 placeholder:text-xs"
                />
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Catégorie active
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t-2 border-sky-100">
              <DashboardButton
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                <Edit className="w-4 h-4 mr-2" />
                {loading ? "Modification..." : "Enregistrer"}
              </DashboardButton>
              <DashboardButton
                type="button"
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Annuler
              </DashboardButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
