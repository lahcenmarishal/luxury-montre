import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  image_url: string | null;
  sort_order: number;
}

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  const { data: slides = [] } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === current || slides.length === 0) return;
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
  }, [isTransitioning, current, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo, slides.length]);

  if (slides.length === 0) {
    return <section className="relative w-full aspect-[1920/750] max-h-[750px] bg-foreground" />;
  }

  return (
    <section className="relative w-full aspect-[1920/750] max-h-[750px] overflow-hidden bg-foreground">
      {slides.map((slide, i) => {
        const isActive = current === i;
        const isPrev = previous === i;

        return (
          <div
            key={slide.id}
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
                transform: isActive ? "scale(1)" : isPrev ? "scale(1.08)" : "scale(1.15)",
                transition: "transform 8s cubic-bezier(0.25, 0.1, 0.25, 1)",
                ...(isActive && { animation: "kenburns 8s ease-out forwards" }),
              }}
            >
              {slide.image_url ? (
                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-foreground to-foreground/80" />
              )}
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
            <div style={{ opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
              <p className="text-primary-foreground/60 text-xs tracking-[0.4em] font-body mb-4 uppercase">
                {slides[current]?.subtitle}
              </p>
            </div>
            <div style={{ opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s" }}>
              <h2 className="text-primary-foreground text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-3 sm:mb-5 tracking-wider leading-[1.1]">
                {slides[current]?.title}
              </h2>
            </div>
            <div style={{ opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s" }}>
              <p className="text-primary-foreground/70 font-body text-xs sm:text-sm md:text-base max-w-md mb-6 sm:mb-10 leading-relaxed">
                {slides[current]?.description}
              </p>
            </div>
            <div style={{ opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s" }}>
              <a href={slides[current]?.link} className="btn-shop-outline">DÉCOUVRIR</a>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-[3px] overflow-hidden transition-all duration-500"
              style={{ width: current === i ? 48 : 24 }}
            >
              <span className="absolute inset-0 bg-primary-foreground/30" />
              {current === i && (
                <span className="absolute inset-0 bg-primary-foreground" style={{ animation: "progressBar 6s linear forwards" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
