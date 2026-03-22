import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id?: string;
  image: string;
  hoverImage: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  badge?: { type: "hot" | "sale"; label: string };
}

const formatMAD = (amount: number) => `${amount.toLocaleString("fr-MA")} MAD`;

const ProductCard = ({ id, image, hoverImage, brand, name, price, oldPrice, badge }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) navigate(`/produit/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      addItem({ id, name, brand, price, image });
      toast({ title: "Ajouté au panier", description: name });
    }
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favs.includes(id)) {
        localStorage.setItem("favorites", JSON.stringify(favs.filter(f => f !== id)));
        toast({ title: "Retiré des favoris", description: name });
      } else {
        localStorage.setItem("favorites", JSON.stringify([...favs, id]));
        toast({ title: "Ajouté aux favoris", description: name });
      }
      window.dispatchEvent(new Event("favorites-updated"));
    } catch {}
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden bg-secondary mb-4">
        {badge && (
          <span className={badge.type === "hot" ? "product-badge-hot" : "product-badge-sale"}>
            {badge.label}
          </span>
        )}
        <img src={image} alt={name} className="w-full aspect-square object-contain p-4 transition-opacity duration-500 group-hover:opacity-0" />
        <img src={hoverImage} alt={`${name} alternate`} className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button onClick={handleAddToFavorites} className="w-9 h-9 bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
          <button onClick={handleAddToCart} className="w-9 h-9 bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button onClick={handleView} className="w-9 h-9 bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-body uppercase mb-1">{brand}</p>
      <h4 className="text-sm font-body text-foreground mb-2 group-hover:text-accent transition-colors">{name}</h4>
      <div className="flex items-center gap-2">
        {oldPrice && <span className="text-sm text-muted-foreground line-through font-body">{formatMAD(oldPrice)}</span>}
        <span className="text-sm font-body text-foreground">{formatMAD(price)}</span>
      </div>
    </div>
  );
};

export default ProductCard;
