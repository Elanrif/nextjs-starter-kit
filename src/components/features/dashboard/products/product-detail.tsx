"use client";

import { Product } from "@/lib/products/models/product.model";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  Package,
  Euro,
  Box,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Hash,
} from "lucide-react";

const { DASHBOARD, PRODUCTS } = ROUTES;

const getStockInfo = (stock: number) => {
  if (stock > 10)
    return {
      label: "En stock",
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    };
  if (stock > 0)
    return {
      label: "Stock faible",
      cls: "bg-amber-50 text-amber-700 ring-amber-200",
    };
  return { label: "Rupture", cls: "bg-red-50 text-red-700 ring-red-200" };
};

export function ProductDetail({ product }: { product: Product }) {
  const stock = getStockInfo(product.stock);

  const createdAt = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 p-8 shadow-xl">
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/30 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-blue-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{product.name}</h1>
            {product.category?.name && (
              <div className="flex items-center gap-1.5 mt-1">
                <Tag className="w-3 h-3 text-slate-500" />
                <span className="text-slate-400 text-sm">
                  {product.category.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ajouté le {createdAt}</span>
            </div>
          </div>
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              product.isActive
                ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30"
                : "bg-red-500/20 text-red-300 ring-1 ring-red-400/30"
            }`}
          >
            {product.isActive ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {product.isActive ? "Actif" : "Inactif"}
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <div className="flex items-center justify-center mb-2">
            <Euro className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Prix</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <div className="flex items-center justify-center mb-2">
            <Box className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
          <p className="text-xs text-gray-400 mt-0.5">Unités</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
          <div className="flex items-center justify-center mb-2">
            <Hash className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 font-mono">
            #{product.id}
          </p>
          <div
            className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${stock.cls}`}
          >
            {stock.label}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="bg-violet-50 text-violet-600 p-3 rounded-xl shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Catégorie
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {product.category?.name || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div
            className={`p-3 rounded-xl shrink-0 ${product.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}
          >
            {product.isActive ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Statut
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {product.isActive ? "Produit actif" : "Produit inactif"}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="bg-gray-50 text-gray-600 p-3 rounded-xl shrink-0 h-fit">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${PRODUCTS}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${PRODUCTS}/edit/${product.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier
        </Link>
      </div>
    </div>
  );
}
