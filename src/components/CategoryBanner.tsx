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
  <section className="section-container py-6 sm:py-8 md:py-12">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
      {banners.map((cat, i) => (
        <ScrollReveal key={cat.title} delay={i * 150}>
          <Link to={cat.link} className={`relative overflow-hidden group cursor-pointer block ${i === 0 ? "col-span-2 md:col-span-1 h-[140px] sm:h-[200px]" : "h-[140px] sm:h-[200px]"} md:h-[300px]`}>
            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/50 transition-colors duration-300" />
            <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6">
              <h3 className="text-primary-foreground text-sm sm:text-lg md:text-2xl font-display font-bold tracking-wider mb-1 sm:mb-3">{cat.title}</h3>
              <span className="btn-shop-outline text-[9px] sm:text-xs px-3 sm:px-6 py-1.5 sm:py-2">DÉCOUVRIR</span>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

export default CategoryBanner;
