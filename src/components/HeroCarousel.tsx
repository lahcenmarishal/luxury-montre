import { useState, useEffect, useCallback } from "react";
import hero1 from "@/assets/hero-1.jpg";
import heroBijoux from "@/assets/hero-bijoux.jpg";
import heroAccessories from "@/assets/hero-accessories.jpg";

const slides = [
  { image: hero1, subtitle: "Collection Montres", title: "MONTRES DE LUXE", desc: "Des montres d'exception alliant tradition horlogère et design contemporain.", link: "/categorie/montres" },
  { image: heroBijoux, subtitle: "Collection Bijoux", title: "BIJOUX D'EXCEPTION", desc: "Bagues, bracelets et pièces uniques façonnées avec les matériaux les plus nobles.", link: "/categorie/bijoux" },
  { image: heroAccessories, subtitle: "Collection Accessoires", title: "ACCESSOIRES PREMIUM", desc: "Lunettes, parfums, stylos et maroquinerie pour compléter votre style.", link: "/categorie/accessoires" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === current) return;
    setTextVisible(false);
    setTimeout(() => {
      setPrevious(current);
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevious(-1);
      }, 1200);
      setTimeout(() => setTextVisible(true), 400);
    }, 300);
  }, [isTransitioning, current]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <section className="relative h-[550px] md:h-[700px] overflow-hidden bg-foreground">
      {slides.map((slide, i) => {
        const isActive = current === i;
        const isPrev = previous === i;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : isPrev ? 1 : 0,
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
              transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: isActive
                  ? "scale(1)"
                  : isPrev
                    ? "scale(1.08)"
                    : "scale(1.15)",
                transition: "transform 8s cubic-bezier(0.25, 0.1, 0.25, 1)",
                ...(isActive && { animation: "kenburns 8s ease-out forwards" }),
              }}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, hsla(0,0%,5%,0.6) 0%, hsla(0,0%,5%,0.2) 50%, transparent 100%)",
              }}
            />
          </div>
        );
      })}

      {/* Content */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="section-container">
          <div className="max-w-xl">
            <div
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
              }}
            >
              <p className="text-primary-foreground/60 text-xs tracking-[0.4em] font-body mb-4 uppercase">
                {slides[current].subtitle}
              </p>
            </div>
            <div
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s",
              }}
            >
              <h2 className="text-primary-foreground text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-5 tracking-wider leading-[1.1]">
                {slides[current].title}
              </h2>
            </div>
            <div
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s",
              }}
            >
              <p className="text-primary-foreground/70 font-body text-sm md:text-base max-w-md mb-10 leading-relaxed">
                {slides[current].desc}
              </p>
            </div>
            <div
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s",
              }}
            >
              <a href={slides[current].link} className="btn-shop-outline">DÉCOUVRIR</a>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative h-[3px] overflow-hidden transition-all duration-500"
            style={{ width: current === i ? 48 : 24 }}
          >
            <span className="absolute inset-0 bg-primary-foreground/30" />
            {current === i && (
              <span
                className="absolute inset-0 bg-primary-foreground"
                style={{
                  animation: "progressBar 6s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
