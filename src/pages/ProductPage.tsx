import { useParams, Link } from "react-router-dom";
import { getProductById, getCategoryBySlug, products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, Heart, ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";

const formatMAD = (amount: number) => `${amount.toLocaleString("fr-MA")} MAD`;

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = getProductById(productId || "");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.image }, quantity);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Navbar />
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-display">Produit introuvable</h2>
          <Link to="/" className="text-accent mt-4 inline-block font-body text-sm">Retour à l'accueil</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = getCategoryBySlug(product.category);
  const subcategory = category?.subcategories.find((s) => s.slug === product.subcategory);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      <div className="section-container py-4 flex items-center gap-2 text-xs font-body text-muted-foreground flex-wrap">
        <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/categorie/${product.category}`} className="hover:text-accent transition-colors">{category?.name}</Link>
        <ChevronRight className="w-3 h-3" />
        {subcategory && (
          <>
            <Link to={`/categorie/${product.category}/${product.subcategory}`} className="hover:text-accent transition-colors">{subcategory.name}</Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="section-container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="bg-secondary mb-4 aspect-square flex items-center justify-center overflow-hidden">
              <img src={product.gallery[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain p-8 transition-opacity duration-300" />
            </div>
            {product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 bg-secondary flex items-center justify-center overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-foreground" : "border-transparent"}`}>
                    <img src={img} alt="" className="max-w-full max-h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-body uppercase mb-2">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through font-body">{formatMAD(product.oldPrice)}</span>
              )}
              <span className="text-2xl font-body text-foreground font-bold">{formatMAD(product.price)}</span>
              {product.badge && (
                <span className={`px-3 py-1 text-[10px] tracking-wider font-body uppercase ${product.badge.type === "hot" ? "bg-[hsl(var(--badge-hot))] text-primary-foreground" : "bg-primary text-primary-foreground"}`}>
                  {product.badge.label}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

            <div className="space-y-3 mb-8 text-xs font-body text-muted-foreground">
              <p><span className="text-foreground font-bold">Référence :</span> {product.reference}</p>
              <p><span className="text-foreground font-bold">Catégorie :</span> {category?.name}</p>
              {subcategory && <p><span className="text-foreground font-bold">Sous-catégorie :</span> {subcategory.name}</p>}
              {product.gender && <p><span className="text-foreground font-bold">Genre :</span> {product.gender === "homme" ? "Homme" : product.gender === "femme" ? "Femme" : "Unisexe"}</p>}
              {product.model && <p><span className="text-foreground font-bold">Modèle :</span> {product.model}</p>}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-body">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-shop flex items-center gap-2 flex-1 justify-center">
                <ShoppingBag className="w-4 h-4" /> AJOUTER AU PANIER
              </button>
            </div>

            <button className="flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-accent transition-colors mb-8">
              <Heart className="w-4 h-4" /> Ajouter aux favoris
            </button>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <Truck className="w-5 h-5 text-foreground" />
                <span>Livraison gratuite dès 500 MAD</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <Shield className="w-5 h-5 text-foreground" />
                <span>Garantie authenticité 100%</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
                <RotateCcw className="w-5 h-5 text-foreground" />
                <span>Retour gratuit sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-display font-bold tracking-wider mb-8">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/produit/${p.id}`}>
                  <ProductCard id={p.id} image={p.image} hoverImage={p.hoverImage} brand={p.brand} name={p.name} price={p.price} oldPrice={p.oldPrice} badge={p.badge} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
