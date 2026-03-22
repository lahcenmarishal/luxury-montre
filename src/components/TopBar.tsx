import { Phone, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TopBar = () => {
  const { data: phone } = useQuery({
    queryKey: ["site-settings-phone"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "phone").maybeSingle();
      return data?.value || "+212 660 304 856";
    },
    staleTime: 60000,
  });

  const displayPhone = phone || "+212 660 304 856";

  return (
    <div className="bg-primary text-primary-foreground py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-wider font-body">
      <div className="section-container flex justify-between items-center gap-2">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <Truck className="w-3 h-3 flex-shrink-0" />
          <span>Livraison gratuite dès 500 MAD</span>
        </span>
        <span className="flex items-center gap-1.5 sm:gap-2">
          <Phone className="w-3 h-3 flex-shrink-0" />
          <a href={`tel:${displayPhone.replace(/\s/g, "")}`} className="hover:text-accent transition-colors whitespace-nowrap">{displayPhone}</a>
        </span>
      </div>
    </div>
  );
};

export default TopBar;
