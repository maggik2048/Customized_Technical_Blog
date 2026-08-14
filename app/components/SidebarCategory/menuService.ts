// menuService.ts
import { createClient } from '@supabase/supabase-js';
import { CATEGORY_TREE } from "../../-Data/CategoryTree";
import { Item } from "../types";

// Configuration du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getMenu(): Promise<Item[]> {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("category");

    if (error) {
      console.error("Erreur Supabase:", error);
      // Retourne la structure sans les compteurs
      return CATEGORY_TREE.map((cat) => ({
        ...cat,
        children: cat.children?.map((child) => ({
          ...child,
          href: `/category/${child.slug}`,
          count: 0,
        })),
      }));
    }

    // Vérifier si posts est un tableau
    if (!posts || !Array.isArray(posts)) {
      console.warn("Aucune donnée reçue de Supabase");
      return CATEGORY_TREE.map((cat) => ({
        ...cat,
        children: cat.children?.map((child) => ({
          ...child,
          href: `/category/${child.slug}`,
          count: 0,
        })),
      }));
    }

    // Calcul des comptes par catégorie
    const counts: Record<string, number> = {};
    posts.forEach((row) => {
      if (row.category && typeof row.category === 'string') {
        const key = row.category.toLowerCase().trim();
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    // Construction de l'arbre avec les compteurs
    return CATEGORY_TREE.map((cat) => ({
      ...cat,
      children: cat.children?.map((child) => ({
        ...child,
        href: `/category/${child.slug}`,
        count: counts[child.slug.toLowerCase()] ?? 0,
      })),
    }));

  } catch (error) {
    console.error("Erreur lors de la récupération du menu:", error);
    // Retourne la structure sans les compteurs en cas d'erreur
    return CATEGORY_TREE.map((cat) => ({
      ...cat,
      children: cat.children?.map((child) => ({
        ...child,
        href: `/category/${child.slug}`,
        count: 0,
      })),
    }));
  }
}