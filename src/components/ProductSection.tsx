import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const tabs = [
  { label: "MONTRES", category: "montres" },
  { label: "BIJOUX", category: "bijoux" },
  { label: "ACCESSOIRES", category: "accessoires" },
];

const ProductSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const { data: products = [] } = useQuery({
    queryKey: ["homepage-products", tabs[activeTab].category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", tabs[activeTab].category)
        .eq("is_active", true)
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-container py-8 sm:py-12 md:py-16">
      <ScrollReveal>
        <div className="flex justify-center gap-4 sm:gap-8 mb-6 sm:mb-12 border-b border-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`pb-2 sm:pb-3 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] font-body transition-all duration-200 ${
                activeTab === i ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-12">
        {products.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 80}>
            <Link to={`/produit/${p.id}`}>
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
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="text-center">
          <Link to={`/categorie/${tabs[activeTab].category}`} className="btn-shop inline-block">VOIR TOUT</Link>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default ProductSection;
