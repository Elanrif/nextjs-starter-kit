"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@/lib/categories/models/category.model";
import LoadingPage from "@/components/features/loading";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  Tag,
  Hash,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryDetail({ data }: { data: Category | null }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setCategory(data);
      setLoading(false);
    }, 200);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [data]);

  if (loading)
    return (
      <LoadingPage isLoading={true} text="Chargement de la catégorie..." />
    );
  if (!category)
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Catégorie introuvable.
      </div>
    );

  const createdAt = new Date(category.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-violet-950 to-slate-900 p-8 shadow-xl">
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/30 flex items-center justify-center shrink-0">
            <Tag className="w-7 h-7 text-violet-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{category.name}</h1>
            <p className="text-slate-400 text-sm mt-1 font-mono">
              {category.slug}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Créée le {createdAt}</span>
            </div>
          </div>
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              category.isActive
                ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30"
                : "bg-red-500/20 text-red-300 ring-1 ring-red-400/30"
            }`}
          >
            {category.isActive ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {category.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Hash,
            label: "Identifiant",
            value: `#${category.id}`,
            color: "text-slate-600",
            bg: "bg-slate-50",
            mono: true,
          },
          {
            icon: Tag,
            label: "Nom",
            value: category.name,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            icon: LinkIcon,
            label: "Slug",
            value: category.slug,
            color: "text-blue-600",
            bg: "bg-blue-50",
            mono: true,
          },
          {
            icon: Calendar,
            label: "Créée le",
            value: createdAt,
            color: "text-gray-600",
            bg: "bg-gray-50",
          },
        ].map(({ icon: Icon, label, value, color, bg, mono }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`${bg} ${color} p-3 rounded-xl shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {label}
              </p>
              <p
                className={`text-sm font-semibold text-gray-800 mt-0.5 truncate ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      {category.description && (
        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="bg-gray-50 text-gray-600 p-3 rounded-xl shrink-0 h-fit">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${CATEGORIES}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${CATEGORIES}/edit/${category.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier
        </Link>
      </div>
    </div>
  );
}
