import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import topCatBg from "@/assets/top-categories-bg.jpg";

const TopCategories = () => (
  <section className="relative h-[280px] sm:h-[350px] md:h-[400px] overflow-hidden">
    <img src={topCatBg} alt="Top Categories" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-foreground/70" />
    <div className="absolute inset-0 flex items-center">
      <div className="section-container w-full flex flex-col md:flex-row items-start md:items-center justify-between">
        <ScrollReveal direction="left">
          <div className="max-w-md">
            <h2 className="text-primary-foreground text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-wider mb-3 sm:mb-4">NOS CATÉGORIES</h2>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed mb-6">
              Montres, bijoux et accessoires de luxe — explorez notre univers et trouvez la pièce qui vous correspond.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/categorie/montres" className="btn-shop-outline text-xs px-5 py-2">MONTRES</Link>
              <Link to="/categorie/bijoux" className="btn-shop-outline text-xs px-5 py-2">BIJOUX</Link>
              <Link to="/categorie/accessoires" className="btn-shop-outline text-xs px-5 py-2">ACCESSOIRES</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default TopCategories;
