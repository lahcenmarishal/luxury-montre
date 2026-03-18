import { Phone, Truck } from "lucide-react";

const TopBar = () => (
  <div className="bg-primary text-primary-foreground py-2 text-xs tracking-wider font-body">
    <div className="section-container flex justify-between items-center">
      <span className="flex items-center gap-2">
        <Truck className="w-3 h-3" />
        Livraison gratuite dès 500 MAD | 30 MAD pour les commandes de moins de 500 MAD
      </span>
      <span className="flex items-center gap-2">
        <Phone className="w-3 h-3" />
        Besoin d'aide : +212 660 304 856
      </span>
    </div>
  </div>
);

export default TopBar;
