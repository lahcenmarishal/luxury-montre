import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    text: "I Am Truly Impressed With The Quality Of The Watches At This Store! The Product Is Authentic, With A Luxurious And Sophisticated Design. When I Received It, Every Detail Was Meticulously Crafted, Exactly As Described...",
    name: "STEVE JOBS",
    role: "Author",
  },
  {
    text: "The craftsmanship is outstanding. Every time I look at my wrist, I'm reminded of the excellence that went into making this timepiece. It's not just a watch, it's a statement.",
    name: "JAMES WILSON",
    role: "Collector",
  },
];

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="bg-secondary py-20">
      <ScrollReveal>
        <div className="section-container max-w-3xl text-center">
          <Quote className="w-10 h-10 text-accent mx-auto mb-8 opacity-30" />
          <p className="text-foreground font-display text-lg md:text-xl italic leading-relaxed mb-8">
            {testimonials[current].text}
          </p>
          <p className="font-body text-sm tracking-[0.2em] text-foreground font-bold">{testimonials[current].name}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">{testimonials[current].role}</p>

          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}
              className="w-8 h-8 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrent((current + 1) % testimonials.length)}
              className="w-8 h-8 border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Testimonial;
