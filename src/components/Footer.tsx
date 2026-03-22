import { Facebook, Instagram, MessageCircle, Phone, MapPin, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings-footer"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", ["whatsapp", "instagram", "facebook", "phone", "email", "address"]);
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value; });
      return map;
    },
    staleTime: 60000,
  });

  const whatsappLink = settings?.whatsapp
    ? settings.whatsapp.startsWith("http") ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`
    : "#";
  const instagramLink = settings?.instagram || "#";
  const facebookLink = settings?.facebook || "#";
  const phone = settings?.phone || "+212 660 304 856";
  const email = settings?.email || "contact@luxurymontre.com";
  const address = settings?.address || "Maroc";

  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {/* Navigation */}
          <div>
            <h4 className="text-xs font-body tracking-[0.2em] text-primary-foreground font-bold mb-4">NAVIGATION</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", href: "/" },
                { label: "Montres", href: "/categorie/montres" },
                { label: "Bijoux", href: "/categorie/bijoux" },
                { label: "Accessoires", href: "/categorie/accessoires" },
                { label: "Services", href: "/services" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-primary-foreground/60 font-body hover:text-accent transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-body tracking-[0.2em] text-primary-foreground font-bold mb-4">SERVICES</h4>
            <ul className="space-y-2">
              {["Garantie", "Conseils personnalisés", "Réparation", "Gravure"].map((link) => (
                <li key={link}>
                  <Link to="/services" className="text-xs text-primary-foreground/60 font-body hover:text-accent transition-colors duration-200">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-body tracking-[0.2em] text-primary-foreground font-bold mb-4">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs text-primary-foreground/60 font-body">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2 text-xs text-primary-foreground/60 font-body">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-primary-foreground/60 font-body">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200" title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center">
          <p className="text-[11px] text-primary-foreground/40 font-body">© 2026 LuxuryMontre. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
