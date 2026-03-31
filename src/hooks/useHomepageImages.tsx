import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fallback static imports
import categoryAntique from "@/assets/category-antique.jpg";
import catBijoux from "@/assets/cat-bijoux.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import topCatBg from "@/assets/top-categories-bg.jpg";
import bannerPrestige from "@/assets/banner-prestige.jpg";

const IMAGE_KEYS = [
  "image_cat_montres",
  "image_cat_bijoux",
  "image_cat_accessoires",
  "image_top_categories_bg",
  "image_prestige_banner",
] as const;

const FALLBACKS: Record<string, string> = {
  image_cat_montres: categoryAntique,
  image_cat_bijoux: catBijoux,
  image_cat_accessoires: catAccessories,
  image_top_categories_bg: topCatBg,
  image_prestige_banner: bannerPrestige,
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
  };
}
