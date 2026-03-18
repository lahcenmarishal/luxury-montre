import { useParams, Link } from "react-router-dom";
import { getCategoryBySlug, getProductsBySubcategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const SubcategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const category = getCategoryBySlug(categorySlug || "");
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug);
  const subcategoryProducts = getProductsBySubcategory(categorySlug || "", subcategorySlug || "");

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Navbar />
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-display">Sous-catégorie introuvable</h2>
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

      {/* Breadcrumb */}
      <div className="section-container py-6 flex items-center gap-2 text-xs font-body text-muted-foreground">
        <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/categorie/${category.slug}`} className="hover:text-accent transition-colors">{category.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{subcategory.name}</span>
      </div>

      <div className="section-container pb-16">
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-2">{subcategory.name}</h1>
        <p className="text-sm text-muted-foreground font-body mb-8">{subcategoryProducts.length} produit(s) trouvé(s)</p>

        {subcategoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {subcategoryProducts.map((p) => (
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
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">Aucun produit dans cette sous-catégorie pour le moment.</p>
            <Link to={`/categorie/${category.slug}`} className="btn-shop inline-block mt-6">Voir toute la catégorie</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SubcategoryPage;
