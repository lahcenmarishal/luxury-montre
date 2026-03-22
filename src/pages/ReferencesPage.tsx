import { useParams, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ReferencesPage = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["references", brandSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, reference, model, price, image_url, brand")
        .eq("is_active", true)
        .ilike("brand", brandSlug || "")
        .order("reference");
      if (error) throw error;
      return data;
    },
  });

  const brandName = products.length > 0 ? products[0].brand : (brandSlug || "").charAt(0).toUpperCase() + (brandSlug || "").slice(1);
  const models = [...new Set(products.map(p => p.model).filter(Boolean))] as string[];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      <div className="section-container py-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
        <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/categorie/montres" className="hover:text-accent transition-colors">Montres</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Références {brandName}</span>
      </div>

      <div className="section-container pb-16">
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-2">
          Références {brandName}
        </h1>
        <p className="text-sm text-muted-foreground font-body mb-8">
          Toutes les références {brandName} disponibles dans notre catalogue.
        </p>

        {isLoading ? (
          <p className="text-muted-foreground font-body">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground font-body">Aucune référence trouvée.</p>
        ) : (
          <>
            {models.map(model => {
              const modelProducts = products.filter(p => p.model === model);
              return (
                <div key={model} className="mb-10">
                  <h2 className="text-lg font-display font-semibold mb-4 tracking-wider border-b border-border pb-2">{model}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {modelProducts.map(p => (
                      <Link
                        key={p.id}
                        to={`/produit/${p.id}`}
                        className="flex items-center gap-4 px-4 py-3 border border-border bg-background hover:bg-secondary transition-colors duration-200"
                      >
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-body text-sm text-foreground block truncate">{p.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{p.reference}</span>
                        </div>
                        <span className="text-sm font-body font-semibold text-foreground whitespace-nowrap">
                          {Number(p.price).toLocaleString()} MAD
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Products without model */}
            {(() => {
              const noModelProducts = products.filter(p => !p.model);
              if (noModelProducts.length === 0) return null;
              return (
                <div className="mb-10">
                  <h2 className="text-lg font-display font-semibold mb-4 tracking-wider border-b border-border pb-2">Autres</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {noModelProducts.map(p => (
                      <Link
                        key={p.id}
                        to={`/produit/${p.id}`}
                        className="flex items-center gap-4 px-4 py-3 border border-border bg-background hover:bg-secondary transition-colors duration-200"
                      >
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-body text-sm text-foreground block truncate">{p.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{p.reference}</span>
                        </div>
                        <span className="text-sm font-body font-semibold text-foreground whitespace-nowrap">
                          {Number(p.price).toLocaleString()} MAD
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ReferencesPage;
