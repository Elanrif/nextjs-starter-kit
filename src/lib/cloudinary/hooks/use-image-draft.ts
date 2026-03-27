"use client";

import { useState } from "react";
import { extractPublicId } from "@/lib/cloudinary/cloudinary.utils";

type ImageDraft = { url: string; publicId: string };

type UseImageDraftOptions = {
  /**
   * Clé localStorage — unique par formulaire et champ.
   * Convention : "{entité}:{champ}:{id|new}"
   * @example "profile:avatar" | "product:image:42" | "product:image:new"
   */
  storageKey: string;
  /** URL initiale depuis le serveur (ex: entity.imageUrl). */
  initialUrl?: string | null;
};

type UseImageDraftReturn = {
  /** URL de l'image (draft ou serveur). */
  url: string;
  /** public_id Cloudinary correspondant. */
  publicId: string;
  /** À passer à <ImageUpload onChange={...} /> */
  handleChange: (url: string, publicId: string) => void;
  /** À passer à <ImageUpload onRemove={...} /> — vide l'état et le draft. */
  handleRemove: () => void;
  /** À appeler après une sauvegarde réussie — supprime le draft localStorage. */
  clearDraft: () => void;
};

function readDraft(storageKey: string): ImageDraft | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ImageDraft;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

/**
 * Hook générique pour gérer un upload d'image avec persistance localStorage.
 *
 * Initialise l'état depuis localStorage (draft non sauvegardé) ou depuis la valeur
 * serveur (`initialUrl`). Pas de useEffect — lecture unique au mount via lazy useState.
 *
 * @example — profil utilisateur
 * const avatar = useImageDraft({ storageKey: "profile:avatar", initialUrl: user.avatarUrl });
 * <ImageUpload value={avatar.url} publicId={avatar.publicId}
 *   onChange={avatar.handleChange} onRemove={avatar.handleRemove} />
 * // Dans onSubmit après succès :
 * avatar.clearDraft();
 *
 * @example — création produit
 * const image = useImageDraft({ storageKey: "product:image:new" });
 *
 * @example — édition produit
 * const image = useImageDraft({ storageKey: `product:image:${product.id}`, initialUrl: product.imageUrl });
 */
export function useImageDraft({
  storageKey,
  initialUrl,
}: UseImageDraftOptions): UseImageDraftReturn {
  const [url, setUrl] = useState<string>(() => {
    const draft = readDraft(storageKey);
    if (draft?.url && draft.url !== initialUrl) return draft.url;
    return initialUrl ?? "";
  });

  const [publicId, setPublicId] = useState<string>(() => {
    const draft = readDraft(storageKey);
    if (draft?.url && draft.url !== initialUrl) return draft.publicId;
    return initialUrl ? extractPublicId(initialUrl) : "";
  });

  function handleChange(newUrl: string, newPublicId: string) {
    setUrl(newUrl);
    setPublicId(newPublicId);
    localStorage.setItem(storageKey, JSON.stringify({ url: newUrl, publicId: newPublicId }));
  }

  function handleRemove() {
    setUrl("");
    setPublicId("");
    localStorage.removeItem(storageKey);
  }

  function clearDraft() {
    localStorage.removeItem(storageKey);
  }

  return { url, publicId, handleChange, handleRemove, clearDraft };
}
