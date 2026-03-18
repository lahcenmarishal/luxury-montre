import { useParams, Link } from "react-router-dom";
import { getCategoryBySlug, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = getCategoryBySlug(categorySlug || "");
  const categoryProducts = getProductsByCategory(categorySlug || "");

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

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-[250px] md:h-[350px] overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
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

      {/* Subcategories */}
      <div className="section-container pb-8">
        <h2 className="text-xl font-display font-bold mb-6 tracking-wider">Sous-catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              to={`/categorie/${category.slug}/${sub.slug}`}
              className="group relative h-[180px] overflow-hidden bg-secondary"
            >
              <img src={sub.image} alt={sub.name} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
                <h3 className="text-primary-foreground text-sm font-body tracking-wider">{sub.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All products */}
      {categoryProducts.length > 0 && (
        <div className="section-container pb-16">
          <h2 className="text-xl font-display font-bold mb-6 tracking-wider">Tous les produits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryProducts.map((p) => (
              <Link key={p.id} to={`/produit/${p.id}`}>
                <ProductCard
                  image={p.image}
                  hoverImage={p.hoverImage}
                  brand={p.brand}
                  name={p.name}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  badge={p.badge}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CategoryPage;
