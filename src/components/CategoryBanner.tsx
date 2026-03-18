import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import categoryAntique from "@/assets/category-antique.jpg";
import catBijoux from "@/assets/cat-bijoux.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";

const banners = [
  { image: categoryAntique, title: "MONTRES", link: "/categorie/montres" },
  { image: catBijoux, title: "BIJOUX", link: "/categorie/bijoux" },
  { image: catAccessories, title: "ACCESSOIRES", link: "/categorie/accessoires" },
];

const CategoryBanner = () => (
  <section className="section-container py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {banners.map((cat, i) => (
        <ScrollReveal key={cat.title} delay={i * 150}>
          <Link to={cat.link} className="relative h-[250px] md:h-[300px] overflow-hidden group cursor-pointer block">
            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/50 transition-colors duration-300" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-primary-foreground text-xl md:text-2xl font-display font-bold tracking-wider mb-3">{cat.title}</h3>
              <span className="btn-shop-outline text-xs px-6 py-2">DÉCOUVRIR</span>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

export default CategoryBanner;
