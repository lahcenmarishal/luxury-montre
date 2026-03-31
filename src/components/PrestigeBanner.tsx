import ScrollReveal from "./ScrollReveal";
import { useHomepageImages } from "@/hooks/useHomepageImages";

const PrestigeBanner = () => {
  const { prestigeBanner } = useHomepageImages();

  return (
    <section className="relative h-[180px] sm:h-[280px] md:h-[450px] overflow-hidden">
      <img src={prestigeBanner} alt="Prestige et Style" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="absolute inset-0 flex items-center">
        <div className="section-container">
          <ScrollReveal direction="left">
            <p className="text-primary-foreground/70 text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] font-body mb-1.5 sm:mb-3">LuxuryMontre</p>
            <h2 className="text-primary-foreground text-base sm:text-2xl md:text-5xl font-display font-bold tracking-wider leading-tight mb-2 sm:mb-6">
              UN SYMBOLE DE<br />PRESTIGE ET D'ÉLÉGANCE
            </h2>
            <a href="/categorie/montres" className="btn-shop-outline text-[9px] sm:text-xs px-4 sm:px-6 py-1.5 sm:py-2.5">DÉCOUVRIR</a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default PrestigeBanner;
