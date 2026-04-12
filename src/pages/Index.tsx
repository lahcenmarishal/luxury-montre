import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBanner from "@/components/CategoryBanner";
import TopCategories from "@/components/TopCategories";
import ProductSection from "@/components/ProductSection";
import PrestigeBanner from "@/components/PrestigeBanner";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "LuxuryMontre",
  description: "Boutique en ligne de montres de luxe, bijoux et accessoires au Maroc",
  url: "https://luxurymontre.ma",
  logo: "https://luxurymontre.ma/favicon.png",
  image: "https://lovable.dev/opengraph-image-p98pqg.png",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    addressCountry: "MA",
  },
  priceRange: "$$",
  currenciesAccepted: "MAD",
  paymentAccepted: "Cash, Virement bancaire",
  areaServed: {
    "@type": "Country",
    name: "Maroc",
  },
};

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Montres de Luxe, Bijoux & Accessoires"
      description="LuxuryMontre, votre boutique en ligne au Maroc pour montres de luxe Glycine, Seiko, Fossil, Casio. Bijoux, lunettes, parfums et maroquinerie. Livraison partout au Maroc."
      keywords="montre luxe maroc, achat montre maroc, glycine montre maroc, seiko maroc, fossil maroc, casio maroc, bijoux luxe maroc, accessoires luxe maroc, montre homme maroc, montre femme maroc, boutique montre en ligne maroc, montre originale maroc, prix montre maroc"
      canonical="https://luxurymontre.ma/"
      jsonLd={jsonLd}
    />
    <TopBar />
    <Navbar />
    <HeroCarousel />
    <CategoryBanner />
    <TopCategories />
    <ProductSection />
    <PrestigeBanner />
    <Footer />
  </div>
);

export default Index;
