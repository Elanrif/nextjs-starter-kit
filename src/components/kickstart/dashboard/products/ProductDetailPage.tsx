"use client";
import LoadingPage from "@/components/kickstart/loading-page";
import { useEffect, useState } from "react";
import { fetchProduct } from "@/lib/products/services/product.client.service";
import { Product } from "@/lib/products/models/product.model";
import { DashboardButton } from "@/components/kickstart/dashboard/DashboardButton";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

const { DASHBOARD, PRODUCTS } = ROUTES;

export function ProductDetailPage({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct(Number(id)).then((res) => {
      if ("id" in res) setProduct(res);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return <LoadingPage isLoading={true} text="Chargement du produit..." />;
  if (!product) return <div>Produit introuvable.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Détail du produit</h2>
      <div>
        <b>ID :</b> {product.id}
      </div>
      <div>
        <b>Nom :</b> {product.name}
      </div>
      <div>
        <b>Description :</b> {product.description}
      </div>
      <div>
        <b>Prix :</b> {product.price} €
      </div>
      <div>
        <b>Stock :</b> {product.stock}
      </div>
      <div>
        <b>Catégorie ID :</b> {product.categoryId}
      </div>
      <div>
        <b>Actif :</b> {product.isActive ? "Oui" : "Non"}
      </div>
      <div>
        <b>Créé le :</b> {new Date(product.createdAt).toLocaleString()}
      </div>
      <div className="flex gap-2 mt-4">
        <Link href={`${DASHBOARD}${PRODUCTS}`}>
          <DashboardButton size="sm">Retour</DashboardButton>
        </Link>
        <Link href={`${DASHBOARD}${PRODUCTS}/edit/${product.id}`}>
          <DashboardButton size="sm" variant="secondary">
            Modifier
          </DashboardButton>
        </Link>
      </div>
    </div>
  );
}
