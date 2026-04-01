import { useParams, Link } from "react-router-dom";
import { getCategoryBySlug } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useHomepageImages } from "@/hooks/useHomepageImages";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = getCategoryBySlug(categorySlug || "");
  const { catMontres, catBijoux, catAccessoires } = useHomepageImages();

  const categoryImageMap: Record<string, string> = {
    montres: catMontres,
    bijoux: catBijoux,
    accessoires: catAccessoires,
  };

  const { data: dbProducts = [] } = useQuery({
    queryKey: ["category-products", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", categorySlug || "")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Navbar />
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-display">Catégorie introuvable</h2>
          <Link to="/" className="text-accent mt-4 inline-block font-body text-sm">Retour à l'accueil</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isMontres = categorySlug === "montres";

  const glycineProducts = dbProducts.filter(p => p.brand?.toLowerCase() === "glycine");
  const glycineModels = [...new Set(glycineProducts.map(p => p.model).filter(Boolean))] as string[];
  const glycineReferences = glycineProducts.map(p => ({ ref: p.reference, name: p.name, id: p.id }));

  const glycineSubcategory = category.subcategories.find(s => s.slug === "glycine");
  const genderSubcategories = category.subcategories.filter(s => s.slug === "homme" || s.slug === "femme");
  const autresMarquesSubcategories = category.subcategories.filter(s => ["seiko", "fossil", "casio"].includes(s.slug));

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-[250px] md:h-[350px] overflow-hidden">
        <img src={categoryImageMap[categorySlug || ""] || category.image} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-primary-foreground text-3xl md:text-5xl font-display font-bold tracking-wider mb-3">{category.name}</h1>
            <p className="text-primary-foreground/70 font-body text-sm max-w-lg mx-auto">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="section-container py-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
        <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{category.name}</span>
      </div>

      {isMontres ? (
        <>
          {/* Gender subcategories */}
          <div className="section-container pb-8">
            <h2 className="text-xl font-display font-bold mb-6 tracking-wider">Par genre</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {genderSubcategories.map((sub) => (
                <Link key={sub.slug} to={`/categorie/montres/${sub.slug}`} className="group relative h-[180px] overflow-hidden bg-secondary">
                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                    <h3 className="text-primary-foreground text-sm font-body tracking-wider">{sub.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Glycine Section */}
          {glycineSubcategory && (
            <div className="section-container pb-10">
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-display font-bold mb-2 tracking-wider">Glycine</h2>
                <p className="text-sm text-muted-foreground font-body mb-6">Marque suisse d'exception, reconnue pour ses montres aviateur et de plongée.</p>

                <div className="mb-8">
                  <h3 className="text-lg font-display font-semibold mb-4 tracking-wider">Produits Glycine</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {glycineProducts.map((p) => (
                      <Link key={p.id} to={`/produit/${p.id}`}>
                        <ProductCard id={p.id} image={p.image_url || ""} hoverImage={p.hover_image_url || p.image_url || ""} brand={p.brand} name={p.name} price={p.price} oldPrice={p.old_price ?? undefined} badge={p.badge_type ? { type: p.badge_type as "hot" | "sale", label: p.badge_label || "" } : undefined} />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Glycine Models */}
                {glycineModels.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-display font-semibold mb-4 tracking-wider">Modèles</h3>
                    <div className="flex flex-wrap gap-3">
                      {glycineModels.map((model) => {
                        const modelProducts = glycineProducts.filter(p => p.model === model);
                        return (
                          <Link
                            key={model}
                            to={`/categorie/montres/glycine?model=${encodeURIComponent(model)}`}
                            className="px-5 py-3 border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200 font-body text-sm"
                          >
                            {model}
                            <span className="ml-2 text-xs text-muted-foreground">({modelProducts.length})</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Glycine References */}
                {glycineReferences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-4 tracking-wider">Références</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {glycineReferences.map((item) => (
                        <Link
                          key={item.ref}
                          to={`/produit/${item.id}`}
                          className="flex items-center justify-between px-4 py-3 border border-border bg-background hover:bg-secondary transition-colors duration-200"
                        >
                          <span className="font-body text-sm text-foreground">{item.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{item.ref}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Autres Marques Section */}
          {autresMarquesSubcategories.length > 0 && (
            <div className="section-container pb-10">
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-display font-bold mb-6 tracking-wider">Autres Marques</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {autresMarquesSubcategories.map((sub) => {
                    const brandProducts = dbProducts.filter(p => p.brand?.toLowerCase() === sub.slug);
                    return (
                      <Link key={sub.slug} to={`/categorie/montres/${sub.slug}`} className="group relative h-[200px] overflow-hidden bg-secondary">
                        <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                          <h3 className="text-primary-foreground text-sm font-body tracking-wider">{sub.name}</h3>
                          <p className="text-primary-foreground/60 text-xs font-body mt-1">{brandProducts.length} produit(s)</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* All watches from DB */}
          {dbProducts.length > 0 && (
            <div className="section-container pb-16">
              <div className="border-t border-border pt-8">
                <h2 className="text-xl font-display font-bold mb-6 tracking-wider">Toutes les montres</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {dbProducts.map((p) => (
                    <Link key={p.id} to={`/produit/${p.id}`}>
                      <ProductCard id={p.id} image={p.image_url || ""} hoverImage={p.hover_image_url || p.image_url || ""} brand={p.brand} name={p.name} price={p.price} oldPrice={p.old_price ?? undefined} badge={p.badge_type ? { type: p.badge_type as "hot" | "sale", label: p.badge_label || "" } : undefined} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Subcategories (non-montres) */}
          <div className="section-container pb-8">
            <h2 className="text-xl font-display font-bold mb-6 tracking-wider">Sous-catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.subcategories.map((sub) => (
                <Link key={sub.slug} to={`/categorie/${category.slug}/${sub.slug}`} className="group relative h-[180px] overflow-hidden bg-secondary">
                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                    <h3 className="text-primary-foreground text-sm font-body tracking-wider">{sub.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {dbProducts.length > 0 && (
            <div className="section-container pb-16">
              <h2 className="text-xl font-display font-bold mb-6 tracking-wider">Tous les produits</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {dbProducts.map((p) => (
                  <Link key={p.id} to={`/produit/${p.id}`}>
                    <ProductCard id={p.id} image={p.image_url || ""} hoverImage={p.hover_image_url || p.image_url || ""} brand={p.brand} name={p.name} price={p.price} oldPrice={p.old_price ?? undefined} badge={p.badge_type ? { type: p.badge_type as "hot" | "sale", label: p.badge_label || "" } : undefined} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default CategoryPage;
