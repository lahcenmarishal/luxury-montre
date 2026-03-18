import { Mail } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const Newsletter = () => (
  <section className="border-y border-border py-12">
    <ScrollReveal>
      <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Mail className="w-10 h-10 text-foreground" />
          <div>
            <h3 className="text-lg font-display font-bold text-foreground tracking-wider">NEWSLETTER SIGN-UP</h3>
            <p className="text-xs text-muted-foreground font-body">Sign up to receive more offers and information about the latest products.</p>
          </div>
        </div>
        <div className="flex w-full md:w-auto">
          <input
            type="email"
            placeholder="Your Email Address..."
            className="bg-secondary text-foreground text-sm font-body px-4 py-3 w-full md:w-80 border border-border focus:outline-none focus:border-accent"
          />
          <button className="btn-shop whitespace-nowrap">SUBSCRIBE</button>
        </div>
      </div>
    </ScrollReveal>
  </section>
);

export default Newsletter;
