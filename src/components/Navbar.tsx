import { Search, User, Heart, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface SubMenu {
  title: string;
  items: { label: string; href: string }[];
}

interface NavItem {
  label: string;
  href: string;
  submenu?: SubMenu[];
}

const navItems: NavItem[] = [
  { label: "ACCUEIL", href: "/" },
  {
    label: "MONTRES",
    href: "/categorie/montres",
    submenu: [
      { title: "Par Genre", items: [{ label: "Homme", href: "/categorie/montres/homme" }, { label: "Femme", href: "/categorie/montres/femme" }] },
      { title: "Glycine", items: [{ label: "Modèles", href: "/categorie/montres/glycine" }, { label: "Références", href: "/categorie/montres/glycine/references" }] },
      { title: "Autres Marques", items: [{ label: "Seiko", href: "/categorie/montres/seiko" }, { label: "Fossil", href: "/categorie/montres/fossil" }, { label: "Casio", href: "/categorie/montres/casio" }] },
    ],
  },
  {
    label: "BIJOUX",
    href: "/categorie/bijoux",
    submenu: [
      { title: "Bijoux", items: [{ label: "Bagues", href: "/categorie/bijoux/bagues" }, { label: "Bracelets", href: "/categorie/bijoux/bracelets" }] },
    ],
  },
  {
    label: "ACCESSOIRES",
    href: "/categorie/accessoires",
    submenu: [
      { title: "Lunettes", items: [{ label: "Lunettes de vue", href: "/categorie/accessoires/lunettes-de-vue" }, { label: "Lunettes de soleil", href: "/categorie/accessoires/lunettes-de-soleil" }] },
      { title: "Parfum & Écriture", items: [{ label: "Parfum", href: "/categorie/accessoires/parfum" }, { label: "Stylos", href: "/categorie/accessoires/stylos" }] },
      { title: "Maroquinerie", items: [{ label: "Porte-documents", href: "/categorie/accessoires/porte-documents" }, { label: "Portefeuille", href: "/categorie/accessoires/portefeuille" }, { label: "Sac à dos", href: "/categorie/accessoires/sac-a-dos" }] },
    ],
  },
  {
    label: "SERVICES",
    href: "/services",
    submenu: [
      { title: "Nos Services", items: [{ label: "Garantie", href: "/services" }, { label: "Conseils personnalisés", href: "/services" }] },
    ],
  },
];

const Navbar = () => {
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="section-container flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-display font-bold tracking-widest text-foreground">LuxuryMontre</Link>

        <ul className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.submenu && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={item.href} className="flex items-center gap-1 cursor-pointer group py-2">
                <span className="text-[11px] tracking-[0.15em] font-body text-foreground group-hover:text-accent transition-colors duration-200">{item.label}</span>
                {item.submenu && <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />}
              </Link>

              {item.submenu && activeMenu === item.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 bg-background border border-border shadow-lg min-w-[400px] p-8 animate-fade-in"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${Math.min(item.submenu.length, 3)}, minmax(0, 1fr))` }}>
                    {item.submenu.map((sub) => (
                      <div key={sub.title}>
                        <h4 className="text-[11px] tracking-[0.15em] font-body font-bold text-foreground mb-3 uppercase">{sub.title}</h4>
                        <ul className="space-y-2">
                          {sub.items.map((link) => (
                            <li key={link.label}>
                              <Link to={link.href} className="text-xs text-muted-foreground font-body hover:text-accent transition-colors duration-200" onClick={() => setActiveMenu(null)}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <Search className="w-5 h-5 text-foreground cursor-pointer hover:text-accent transition-colors" />
          <Link to="#" className="hidden sm:block" title="Mon compte">
            <User className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
          </Link>
          <Heart className="w-5 h-5 text-foreground cursor-pointer hover:text-accent transition-colors hidden sm:block" />
          <button onClick={() => setCartOpen(true)} className="relative" title="Panier">
            <ShoppingBag className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{totalItems}</span>
            )}
          </button>
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <ul className="section-container py-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <div className="flex items-center justify-between">
                  <Link to={item.href} onClick={() => !item.submenu && setMobileOpen(false)} className="py-3 text-sm tracking-widest font-body text-foreground flex-1">
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <button onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)} className="p-3">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {item.submenu && mobileExpanded === item.label && (
                  <div className="pl-4 pb-4 space-y-4">
                    {item.submenu.map((sub) => (
                      <div key={sub.title}>
                        <h4 className="text-[11px] tracking-[0.15em] font-body font-bold text-foreground mb-2 uppercase">{sub.title}</h4>
                        <ul className="space-y-1 pl-2">
                          {sub.items.map((link) => (
                            <li key={link.label}>
                              <Link to={link.href} onClick={() => setMobileOpen(false)} className="text-xs text-muted-foreground font-body hover:text-accent transition-colors block py-1">
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
