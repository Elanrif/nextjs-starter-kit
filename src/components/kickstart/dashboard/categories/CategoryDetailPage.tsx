"use client";
import { useEffect, useState } from "react";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import Link from "next/link";
import { Category } from "@/lib/categories/models/category.model";
import LoadingPage from "@/components/kickstart/loading-page";
import { ROUTES } from "@/utils/routes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryDetailPage({ data }: { data: Category | null }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setCategory(data);
      setLoading(false);
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [data]);

  // useEffect(() => {
  //   // Client Side fetching
  //   fetchCategory(Number(id)).then((res) => {
  //     if ("id" in res) setCategory(res);
  //     else setCategory(null);
  //     setLoading(false);
  //   });
  // }, [id]);

  if (loading)
    return (
      <LoadingPage isLoading={true} text="Chargement de la catégorie..." />
    );
  if (!category)
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-gray-500 text-lg">Catégorie introuvable.</p>
        </Card>
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Tag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-sm text-gray-500">ID: #{category.id}</p>
          </div>
        </div>
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Actif" : "Inactif"}
        </Badge>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Card */}
        <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="space-y-5">
            <div className="border-b pb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Nom
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {category.name}
              </p>
            </div>
            <div className="border-b pb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Slug
              </label>
              <p className="text-sm font-mono text-gray-700 bg-gray-50 p-3 rounded-md">
                {category.slug}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Description
              </label>
              <p className="text-sm text-gray-700 leading-relaxed">
                {category.description || (
                  <span className="italic text-gray-400">—</span>
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Meta Card */}
        <Card className="p-6 space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100">
            {category.isActive ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Statut
              </p>
              <p className="font-semibold text-gray-900">
                {category.isActive ? "Catégorie Active" : "Catégorie Inactive"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-100">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Créé le
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(category.createdAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(category.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Link href={`${DASHBOARD}${CATEGORIES}`} className="flex-1">
          <DashboardButton size="lg" variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </DashboardButton>
        </Link>
        <Link
          href={`${DASHBOARD}${CATEGORIES}/edit/${category.id}`}
          className="flex-1"
        >
          <DashboardButton size="lg" className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </DashboardButton>
        </Link>
      </div>
    </div>
  );
}
