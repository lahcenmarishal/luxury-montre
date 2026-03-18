import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const footerCols = [
  { title: "MONTRES", links: ["Homme", "Femme", "Glycine", "Seiko", "Fossil", "Casio"] },
  { title: "BIJOUX & ACCESSOIRES", links: ["Bagues", "Bracelets", "Lunettes de vue", "Lunettes de soleil", "Parfum", "Maroquinerie"] },
  { title: "SERVICES", links: ["Garantie", "Conseils personnalisés", "Réparation", "Gravure", "Livraison", "Retours"] },
  { title: "INFORMATIONS", links: ["À propos", "Contact", "Conditions générales", "Politique de confidentialité", "FAQ"] },
];

const Footer = () => {
  const { data: socialLinks } = useQuery({
    queryKey: ["site-settings-social"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", ["whatsapp", "instagram", "facebook"]);
      const map: Record<string, string> = {};
      data?.forEach((r: any) => { map[r.key] = r.value; });
      return map;
    },
    staleTime: 60000,
  });

  const whatsappLink = socialLinks?.whatsapp
    ? socialLinks.whatsapp.startsWith("http") ? socialLinks.whatsapp : `https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, "")}`
    : "#";
  const instagramLink = socialLinks?.instagram || "#";
  const facebookLink = socialLinks?.facebook || "#";

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-body tracking-[0.2em] text-primary-foreground font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-primary-foreground/60 font-body hover:text-accent transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200" title="WhatsApp">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200" title="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-200" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-wider font-body text-primary-foreground/50 mr-2">PAIEMENT SÉCURISÉ</span>
            <div className="flex items-center gap-2">
              {["VISA", "MC", "AMEX", "CMI"].map((mode) => (
                <span key={mode} className="px-3 py-1 border border-primary-foreground/30 text-[10px] font-body tracking-wider text-primary-foreground/70">
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-primary-foreground/40 font-body">Copyright © 2026 LuxuryMontre. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
