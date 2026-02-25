"use client";
import { useEffect, useState } from "react";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import Link from "next/link";
import { fetchCategory } from "@/lib/categories/services/category.client.service";
import { Category } from "@/lib/categories/models/category.model";
import LoadingPage from "@/components/kickstart/loading-page";
import { ROUTES } from "@/utils/routes";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryDetailPage({ id }: { id: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory(Number(id)).then((res) => {
      if ("id" in res) setCategory(res);
      else setCategory(null);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <LoadingPage isLoading={true} text="Chargement de la catégorie..." />
    );
  if (!category) return <div>Catégorie introuvable.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Détail de la catégorie</h2>
      <div>
        <b>ID :</b> {category.id}
      </div>
      <div>
        <b>Nom :</b> {category.name}
      </div>
      <div>
        <b>Description :</b> {category.description}
      </div>
      <div>
        <b>Slug :</b> {category.slug}
      </div>
      <div>
        <b>Actif :</b> {category.isActive ? "Oui" : "Non"}
      </div>
      <div>
        <b>Créé le :</b> {new Date(category.createdAt).toLocaleString()}
      </div>
      <div className="flex gap-2 mt-4">
        <Link href={`${DASHBOARD}${CATEGORIES}`}>
          <DashboardButton size="sm">Retour</DashboardButton>
        </Link>
        <Link href={`${DASHBOARD}${CATEGORIES}/edit/${category.id}`}>
          <DashboardButton size="sm" variant="secondary">
            Modifier
          </DashboardButton>
        </Link>
      </div>
    </div>
  );
}
