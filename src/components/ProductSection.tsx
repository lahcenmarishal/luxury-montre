import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const tabs = [
  { label: "MONTRES", category: "montres" },
  { label: "BIJOUX", category: "bijoux" },
  { label: "ACCESSOIRES", category: "accessoires" },
];

const ProductSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const filtered = products.filter((p) => p.category === tabs[activeTab].category).slice(0, 8);

  return (
    <section className="section-container py-16">
      <ScrollReveal>
        <div className="flex justify-center gap-8 mb-12 border-b border-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`pb-3 text-xs tracking-[0.2em] font-body transition-all duration-200 ${
                activeTab === i ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {filtered.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 80}>
            <Link to={`/produit/${p.id}`}>
              <ProductCard
                id={p.id}
                image={p.image}
                hoverImage={p.hoverImage}
                brand={p.brand}
                name={p.name}
                price={p.price}
                oldPrice={p.oldPrice}
                badge={p.badge}
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
