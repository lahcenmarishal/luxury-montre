import { Phone, Truck } from "lucide-react";

const TopBar = () => (
  <div className="bg-primary text-primary-foreground py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wider font-body">
    <div className="section-container flex justify-between items-center gap-2">
      <span className="flex items-center gap-1.5 sm:gap-2">
        <Truck className="w-3 h-3 flex-shrink-0" />
        <span className="hidden xs:inline">Livraison gratuite dès 500 MAD</span>
        <span className="xs:hidden">Livraison gratuite dès 500 MAD</span>
      </span>
      <span className="flex items-center gap-1.5 sm:gap-2">
        <Phone className="w-3 h-3 flex-shrink-0" />
        <a href="tel:+212660304856" className="hover:text-accent transition-colors whitespace-nowrap">+212 660 304 856</a>
      </span>
    </div>
  </div>
);

export default TopBar;
