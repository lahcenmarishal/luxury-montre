import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fallback static imports
import categoryAntique from "@/assets/category-antique.jpg";
import catBijoux from "@/assets/cat-bijoux.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import topCatBg from "@/assets/top-categories-bg.jpg";
import bannerPrestige from "@/assets/banner-prestige.jpg";
import watch2 from "@/assets/watch-2.png";
import watch4 from "@/assets/watch-4.png";
import watch6 from "@/assets/watch-6.png";
import glasses1 from "@/assets/glasses-1.png";
import sunglasses2 from "@/assets/sunglasses-2.png";
import perfume1 from "@/assets/perfume-1.png";
import pen1 from "@/assets/pen-1.png";
import briefcase1 from "@/assets/briefcase-1.png";
import wallet1 from "@/assets/wallet-1.png";
import backpack1 from "@/assets/backpack-1.png";
import ring3 from "@/assets/ring-3.png";
import bracelet1 from "@/assets/bracelet-1.png";

const IMAGE_KEYS = [
  "image_cat_montres",
  "image_cat_bijoux",
  "image_cat_accessoires",
  "image_top_categories_bg",
  "image_prestige_banner",
  // Watch genders
  "image_montres_homme",
  "image_montres_femme",
  "image_montres_unisexe",
  // Bijoux subcategories
  "image_bijoux_bagues",
  "image_bijoux_bracelets",
  // Accessoires subcategories
  "image_accessoires_lunettes_de_vue",
  "image_accessoires_lunettes_de_soleil",
  "image_accessoires_parfum",
  "image_accessoires_stylos",
  "image_accessoires_porte_documents",
  "image_accessoires_portefeuille",
  "image_accessoires_sac_a_dos",
  "image_accessoires_ceintures",
] as const;

const FALLBACKS: Record<string, string> = {
  image_cat_montres: categoryAntique,
  image_cat_bijoux: catBijoux,
  image_cat_accessoires: catAccessories,
  image_top_categories_bg: topCatBg,
  image_prestige_banner: bannerPrestige,
  image_montres_homme: watch2,
  image_montres_femme: watch4,
  image_montres_unisexe: watch6,
  image_bijoux_bagues: ring3,
  image_bijoux_bracelets: bracelet1,
  image_accessoires_lunettes_de_vue: glasses1,
  image_accessoires_lunettes_de_soleil: sunglasses2,
  image_accessoires_parfum: perfume1,
  image_accessoires_stylos: pen1,
  image_accessoires_porte_documents: briefcase1,
  image_accessoires_portefeuille: wallet1,
  image_accessoires_sac_a_dos: backpack1,
  image_accessoires_ceintures: briefcase1,
};

export function useHomepageImages() {
  const { data: images = FALLBACKS } = useQuery({
    queryKey: ["homepage-images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", IMAGE_KEYS as unknown as string[]);
      const result = { ...FALLBACKS };
      data?.forEach((r: any) => {
        if (r.value) result[r.key] = r.value;
      });
      return result;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    catMontres: images.image_cat_montres,
    catBijoux: images.image_cat_bijoux,
    catAccessoires: images.image_cat_accessoires,
    topCategoriesBg: images.image_top_categories_bg,
    prestigeBanner: images.image_prestige_banner,
    // Subcategory images helper
    getSubcategoryImage: (category: string, subcategory: string): string => {
      const key = `image_${category}_${subcategory.replace(/-/g, "_")}`;
      return images[key] || "";
    },
    allImages: images,
  };
}
