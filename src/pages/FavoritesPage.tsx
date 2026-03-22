import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FavoritesPage = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setFavoriteIds(JSON.parse(localStorage.getItem("favorites") || "[]"));
    } catch { setFavoriteIds([]); }
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ["favorites-products", favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", favoriteIds)
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
    enabled: favoriteIds.length > 0,
  });

  const removeFavorite = (id: string) => {
    const updated = favoriteIds.filter(fid => fid !== id);
    setFavoriteIds(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      <div className="section-container py-8 sm:py-12">
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-8 flex items-center gap-3">
          <Heart className="w-6 h-6" /> Mes Favoris
        </h1>

        {favoriteIds.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-4">Vous n'avez pas encore de favoris.</p>
            <Link to="/">
              <Button variant="outline">Découvrir nos produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="border border-border bg-background flex gap-4 p-4">
                <Link to={`/produit/${p.id}`} className="flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-20 h-20 object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-muted" />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-body">{p.brand}</p>
                  <Link to={`/produit/${p.id}`} className="font-body text-sm font-medium text-foreground hover:text-accent transition-colors block truncate">
                    {p.name}
                  </Link>
                  <p className="font-body text-sm font-semibold mt-1">{Number(p.price).toLocaleString()} MAD</p>
                </div>
                <button onClick={() => removeFavorite(p.id)} className="text-muted-foreground hover:text-destructive transition-colors self-start" title="Retirer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
