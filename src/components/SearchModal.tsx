import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results = [] } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (query.length < 2) return [];
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, price, image_url, category")
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,reference.ilike.%${query}%`)
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: query.length >= 2,
  });

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-foreground/50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-lg mx-4 shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un produit, une marque..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        {query.length >= 2 && (
          <div className="max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground font-body text-sm">Aucun résultat pour "{query}"</p>
            ) : (
              <ul>
                {results.map(p => (
                  <li key={p.id}>
                    <Link
                      to={`/produit/${p.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-secondary transition-colors"
                    >
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-muted flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="text-sm font-body font-semibold whitespace-nowrap">{Number(p.price).toLocaleString()} MAD</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
