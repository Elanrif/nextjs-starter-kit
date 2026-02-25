"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import { toast } from "react-toastify";
import {
  fetchCategory,
  updateCategory,
} from "@/lib/categories/services/category.client.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryCreateSchema,
  CategoryCreateInput,
} from "@/lib/categories/models/category.model";
import { ROUTES } from "@/utils/routes";
import LoadingPage from "@/components/kickstart/loading-page";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryEditPage({ id }: { id: string }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema) as any,
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

  const onSubmit = async (data: CategoryCreateInput) => {
    setLoading(true);
    const anyRes = (await updateCategory(Number(id), data)) as any;
    setLoading(false);
    const updatedId = anyRes?.id ?? anyRes?.data?.id ?? anyRes?.result?.id;
    if (updatedId) {
      toast.success("Catégorie modifiée avec succès");
      router.push(`${DASHBOARD}${CATEGORIES}/${updatedId}`);
      return;
    }
    if (anyRes && anyRes.message && Array.isArray(anyRes.message.details)) {
      for (const d of anyRes.message.details) {
        if (d.field)
          setError(d.field as any, { type: "server", message: d.message });
      }
      toast.error("Erreur de validation côté serveur");
      return;
    }
    toast.error(
      anyRes?.message?.message ||
        anyRes?.message ||
        "Erreur lors de la modification",
    );
  };

  if (loading)
    return (
      <LoadingPage isLoading={true} text="Chargement de la catégorie..." />
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-w-md mx-auto bg-white shadow rounded-lg shadow-gray-300 p-6"
    >
      <h2 className="text-2xl font-bold mb-2">Modifier la catégorie</h2>
      <section className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Nom
          </span>
          <input
            {...register("name")}
            placeholder="Nom"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </label>
        <label className="block">
          <span className="block mb-1 after:content-['*'] after:ml-1 after:text-red-500">
            Slug
          </span>
          <input
            {...register("slug")}
            placeholder="Slug"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.slug && (
            <span className="text-red-500 text-sm">{errors.slug.message}</span>
          )}
        </label>
        <label className="block col-span-2">
          <span className="block mb-1">Description</span>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
        </label>
        <label className="flex items-center gap-2 col-span-2">
          <input type="checkbox" {...register("isActive")} /> Actif
        </label>
      </section>
      <div className="flex gap-2 mt-4">
        <DashboardButton type="submit" disabled={loading}>
          {loading ? "Modification..." : "Enregistrer"}
        </DashboardButton>
        <DashboardButton
          type="button"
          variant="secondary"
          onClick={() => history.back()}
        >
          Annuler
        </DashboardButton>
      </div>
    </form>
  );
}
