import { Search, User, Heart, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SearchModal from "@/components/SearchModal";

interface SubMenu {
  title: string;
  items: { label: string; href: string }[];
}

interface NavItem {
  label: string;
  href: string;
  submenu?: SubMenu[];
}

const staticNavItems: NavItem[] = [
  { label: "ACCUEIL", href: "/" },
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
      { title: "Maroquinerie", items: [{ label: "Porte-documents", href: "/categorie/accessoires/porte-documents" }, { label: "Portefeuille", href: "/categorie/accessoires/portefeuille" }, { label: "Sac à dos", href: "/categorie/accessoires/sac-a-dos" }, { label: "Ceintures", href: "/categorie/accessoires/ceintures" }] },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Fetch brands from DB for dynamic menu
  const { data: brands = [] } = useQuery({
    queryKey: ["nav-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .eq("display_in_menu", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch brand models for dynamic menu
  const { data: brandModels = [] } = useQuery({
    queryKey: ["nav-brand-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_models")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Build dynamic MONTRES menu from brands
  const montresBrands = brands.filter(b => b.category === "montres");

  const montresSubmenu: SubMenu[] = [
    { title: "Par Genre", items: [{ label: "Homme", href: "/categorie/montres/homme" }, { label: "Femme", href: "/categorie/montres/femme" }, { label: "Unisexe", href: "/categorie/montres/unisexe" }] },
  ];

  // Add each brand with its models as submenu sections
  if (montresBrands.length > 0) {
    montresBrands.forEach(b => {
      const models = brandModels.filter((m: any) => m.brand_id === b.id);
      const items = [{ label: `Tous ${b.name}`, href: `/categorie/montres/${b.slug}` }];
      models.forEach((m: any) => {
        items.push({ label: m.name, href: `/categorie/montres/${b.slug}/${m.slug}` });
      });
      montresSubmenu.push({ title: b.name, items });
    });
  }
    { label: "MONTRES", href: "/categorie/montres", submenu: montresSubmenu },
    ...staticNavItems.slice(1), // BIJOUX, ACCESSOIRES, SERVICES
  ];

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

  // Get favorites count from localStorage
  const [favCount, setFavCount] = useState(0);
  useEffect(() => {
    const updateFavCount = () => {
      try {
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavCount(favs.length);
      } catch { setFavCount(0); }
    };
    updateFavCount();
    window.addEventListener("storage", updateFavCount);
    window.addEventListener("favorites-updated", updateFavCount);
    return () => {
      window.removeEventListener("storage", updateFavCount);
      window.removeEventListener("favorites-updated", updateFavCount);
    };
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="section-container flex items-center justify-between py-3 sm:py-4">
          <Link to="/" className="text-sm sm:text-lg md:text-2xl font-display font-bold tracking-widest text-foreground">
            LuxuryMontre
          </Link>

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

          <div className="flex items-center gap-3 sm:gap-5">
            <button onClick={() => setSearchOpen(true)} title="Rechercher">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-foreground cursor-pointer hover:text-accent transition-colors" />
            </button>
            <Link to="/admin" className="hidden sm:block" title="Mon compte">
              <User className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
            </Link>
            <Link to="/favoris" className="hidden sm:block relative" title="Favoris">
              <Heart className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
              {favCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{favCount}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative" title="Panier">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-foreground hover:text-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{totalItems}</span>
              )}
            </button>
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
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
              {/* Mobile-only links */}
              <li>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-3 text-sm tracking-widest font-body text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> MON COMPTE
                </Link>
              </li>
              <li>
                <Link to="/favoris" onClick={() => setMobileOpen(false)} className="py-3 text-sm tracking-widest font-body text-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4" /> FAVORIS {favCount > 0 && `(${favCount})`}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
