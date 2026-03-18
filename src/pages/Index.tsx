import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBanner from "@/components/CategoryBanner";
import TopCategories from "@/components/TopCategories";
import ProductSection from "@/components/ProductSection";
import PrestigeBanner from "@/components/PrestigeBanner";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
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
