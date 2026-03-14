"use client";
import LoadingPage from "@/components/kickstart/loading-page";
import { useEffect, useState } from "react";
import { Product } from "@/lib/products/models/product.model";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import { fetchProduct } from "@/lib/products/services/product.client.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  Box,
  Layers,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const { DASHBOARD, PRODUCTS } = ROUTES;

// Helper pour le statut du stock
const getStockInfo = (stock: number) => {
  if (stock > 10) return { status: "En stock", color: "text-green-600" };
  if (stock > 0) return { status: "Stock faible", color: "text-yellow-600" };
  return { status: "Rupture", color: "text-red-600" };
};

export function ProductDetailPage({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client Side fetching
    fetchProduct(Number(id)).then((res) => {
      if (res.ok) setProduct(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return <LoadingPage isLoading={true} text="Chargement du produit..." />;
  if (!product)
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-gray-500 text-lg">Produit introuvable.</p>
        </Card>
      </div>
    );

  const { status: stockStatus, color: stockColor } = getStockInfo(
    product.stock,
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">ID: #{product.id}</p>
          </div>
        </div>
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Actif" : "Inactif"}
        </Badge>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Card */}
        <Card
          className="p-6 space-y-4 hover:shadow-lg transition-shadow
         bg-linear-to-br from-slate-900 via-slate-800 to-slate-700"
        >
          <div className="space-y-5">
            <div className="border-b pb-4">
              <label className="text-xs font-semibold text-gray-50 uppercase tracking-wide mb-2 block">
                Nom du produit
              </label>
              <p className="text-lg font-semibold text-gray-300">
                {product.name}
              </p>
            </div>
            <div className="border-b pb-4">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Description
              </label>
              <p className="text-sm text-gray-300 leading-relaxed">
                {product.description || (
                  <span className="italic text-gray-300">—</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Catégorie
              </label>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-300">
                  ID: {product.category?.id || "—"} -{" "}
                  {product.category?.name || "Aucune"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics Card */}
        <Card className="p-6 space-y-3 bg-linear-to-br from-cyan-700 to-blue-900">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <DollarSign className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Prix
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {product.price}€
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <Box className={`w-5 h-5 shrink-0 ${stockColor}`} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Stock
              </p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-900">
                  {product.stock}
                </p>
                <Badge variant="outline" className="text-xs">
                  {stockStatus}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            {product.isActive ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Statut
              </p>
              <p className="font-semibold text-gray-900">
                {product.isActive ? "Produit Actif" : "Produit Inactif"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Créé le
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(product.createdAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(product.createdAt).toLocaleTimeString("fr-FR", {
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
        <Link href={`${DASHBOARD}${PRODUCTS}`} className="flex-1">
          <DashboardButton size="lg" variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </DashboardButton>
        </Link>
        <Link
          href={`${DASHBOARD}${PRODUCTS}/edit/${product.id}`}
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
