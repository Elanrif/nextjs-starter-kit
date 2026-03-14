"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import { toast } from "react-toastify";
import { createCategory } from "@/lib/categories/services/category.client.service";
import LoadingPage from "@/components/kickstart/loading-page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils/routes";
import {
  CategoryFormData,
  categorySchema,
} from "@/lib/categories/models/category.model";
import { Card } from "@/components/ui/card";
import { Plus, ArrowLeft, Tag } from "lucide-react";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
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

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles category creation with robust error management.
   * Uses try/catch/finally to catch unexpected errors (e.g., JS crash, network issues, etc.)
   * and ensures loading is always stopped, even if an exception occurs.
   */
  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const anyRes = (await createCategory(data)) as any;
      const createdId = anyRes?.id ?? anyRes?.data?.id ?? anyRes?.result?.id;
      if (createdId) {
        toast.success("Catégorie créée avec succès");
        router.push(`${DASHBOARD}${CATEGORIES}/${createdId}`);
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
          "Erreur lors de la création",
      );
    } catch (error: any) {
      toast.error(error.message || "Unexpected error during category creation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingPage isLoading={loading} text="Création de la catégorie..." />
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Créer une catégorie
              </h1>
              <p className="text-sm text-gray-500">
                Ajouter une nouvelle catégorie à votre catalogue
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

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2 after:content-['*'] after:ml-1 after:text-red-500">
                    Nom
                  </span>
                  <input
                    {...register("name")}
                    placeholder="Ex: Électronique"
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
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
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                  {errors.slug && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.slug.message}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </span>
                  <textarea
                    {...register("description")}
                    placeholder="Décrivez cette catégorie..."
                    rows={4}
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL
                  </span>
                  <input
                    {...register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
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
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? "Création..." : "Créer la catégorie"}
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
