import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const formatMAD = (amount: number) => `${amount.toLocaleString("fr-MA")} MAD`;

const CartSidebar = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, isOpen, setIsOpen } = useCart();
  const shippingCost = totalPrice >= 500 ? 0 : 30;
  const orderTotal = totalPrice + shippingCost;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display tracking-wider text-lg">
            MON PANIER ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-sm font-body text-muted-foreground">Votre panier est vide</p>
            <button onClick={() => setIsOpen(false)} className="btn-shop text-xs">
              CONTINUER MES ACHATS
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border pb-4">
                  <div className="w-20 h-20 bg-secondary flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.15em] text-muted-foreground font-body uppercase">{item.brand}</p>
                    <p className="text-sm font-display font-bold tracking-wide truncate">{item.name}</p>
                    <p className="text-sm font-body font-bold mt-1">{formatMAD(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-body">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-secondary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatMAD(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-body">
                <span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" /> Livraison</span>
                <span className={shippingCost === 0 ? "text-green-600" : ""}>{shippingCost === 0 ? "Gratuite" : formatMAD(shippingCost)}</span>
              </div>
              {totalPrice < 500 && (
                <p className="text-[11px] font-body text-muted-foreground">
                  Plus que {formatMAD(500 - totalPrice)} pour la livraison gratuite !
                </p>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-body font-bold">Total</span>
                <span className="text-lg font-display font-bold">{formatMAD(orderTotal)}</span>
              </div>
              <Link to="/commande" onClick={() => setIsOpen(false)} className="btn-shop w-full text-center text-xs block">
                PASSER LA COMMANDE
              </Link>
              <button onClick={() => setIsOpen(false)} className="w-full text-center text-xs font-body text-muted-foreground hover:text-accent transition-colors py-2 tracking-wider">
                CONTINUER MES ACHATS
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
