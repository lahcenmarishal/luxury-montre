import ScrollReveal from "./ScrollReveal";
import bannerImg from "@/assets/banner-prestige.jpg";

const PrestigeBanner = () => (
  <section className="relative h-[280px] sm:h-[350px] md:h-[450px] overflow-hidden">
    <img src={bannerImg} alt="Prestige et Style" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-foreground/40" />
    <div className="absolute inset-0 flex items-center">
      <div className="section-container">
        <ScrollReveal direction="left">
          <p className="text-primary-foreground/70 text-xs tracking-[0.3em] font-body mb-3">LuxuryMontre</p>
          <h2 className="text-primary-foreground text-3xl md:text-5xl font-display font-bold tracking-wider leading-tight mb-6">
            UN SYMBOLE DE<br />PRESTIGE ET D'ÉLÉGANCE
          </h2>
          <a href="/categorie/montres" className="btn-shop-outline">DÉCOUVRIR</a>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default PrestigeBanner;
