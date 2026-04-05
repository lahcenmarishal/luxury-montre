import { useParams, Link } from "react-router-dom";
import { getCategoryBySlug } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SubcategoryPage = () => {
  const { categorySlug, subcategorySlug, modelSlug } = useParams<{ categorySlug: string; subcategorySlug: string; modelSlug?: string }>();
  const category = getCategoryBySlug(categorySlug || "");
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug);

  // Fetch brands to check if subcategorySlug is a brand
  const { data: brands = [] } = useQuery({
    queryKey: ["nav-brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const isBrandSlug = categorySlug === "montres" && brands.some((b: any) => b.slug === subcategorySlug);
  const isGenderSlug = categorySlug === "montres" && ["homme", "femme", "unisexe"].includes(subcategorySlug || "");

  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["subcategory-products", categorySlug, subcategorySlug, modelSlug],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (isBrandSlug) {
        query = query.eq("category", "montres").ilike("brand", subcategorySlug || "");
        if (modelSlug) {
          query = query.ilike("model", modelSlug.replace(/-/g, " "));
        }
      } else if (isGenderSlug) {
        query = query.eq("category", "montres").eq("gender", subcategorySlug || "");
      } else {
        query = query.eq("category", categorySlug || "").eq("subcategory", subcategorySlug || "");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: categorySlug === "montres" ? brands.length > 0 : true,
  });

  const displayName = subcategory?.name
    || (isBrandSlug ? (brands.find((b: any) => b.slug === subcategorySlug)?.name || subcategorySlug) + (modelSlug ? ` — ${modelSlug.replace(/-/g, " ")}` : "") : null)
    || (isGenderSlug ? (subcategorySlug === "homme" ? "Homme" : subcategorySlug === "femme" ? "Femme" : "Unisexe") : null)
    || subcategorySlug || "";

  if (!category && !isBrandSlug && !isGenderSlug) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Navbar />
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-display">Sous-catégorie introuvable</h2>
          <Link to="/" className="text-accent mt-4 inline-block font-body text-sm">Retour à l'accueil</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      {/* Breadcrumb */}
      <div className="section-container py-6 flex items-center gap-2 text-xs font-body text-muted-foreground">
        <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/categorie/${categorySlug}`} className="hover:text-accent transition-colors capitalize">{category?.name || categorySlug}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground capitalize">{displayName}</span>
      </div>

      <div className="section-container pb-16">
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-2">{subcategory.name}</h1>
        <p className="text-sm text-muted-foreground font-body mb-8">{dbProducts.length} produit(s) trouvé(s)</p>

        {isLoading ? (
          <p className="text-muted-foreground font-body">Chargement...</p>
        ) : dbProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dbProducts.map((p) => (
              <Link key={p.id} to={`/produit/${p.id}`}>
                <ProductCard
                  id={p.id}
                  image={p.image_url || ""}
                  hoverImage={p.hover_image_url || p.image_url || ""}
                  brand={p.brand}
                  name={p.name}
                  price={p.price}
                  oldPrice={p.old_price ?? undefined}
                  badge={p.badge_type ? { type: p.badge_type as "hot" | "sale", label: p.badge_label || "" } : undefined}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">Aucun produit dans cette sous-catégorie pour le moment.</p>
            <Link to={`/categorie/${category.slug}`} className="btn-shop inline-block mt-6">Voir toute la catégorie</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SubcategoryPage;
