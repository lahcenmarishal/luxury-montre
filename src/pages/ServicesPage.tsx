import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, MessageCircle, Wrench, Gem } from "lucide-react";
import catServices from "@/assets/cat-services.jpg";

const services = [
  {
    icon: Shield,
    title: "Garantie",
    description: "Tous nos produits sont couverts par une garantie internationale de 2 ans minimum. Nous certifions l'authenticité de chaque article vendu sur notre plateforme. En cas de défaut de fabrication, nous assurons la réparation ou le remplacement gratuit.",
  },
  {
    icon: MessageCircle,
    title: "Conseils Personnalisés",
    description: "Notre équipe d'experts en horlogerie et bijouterie est à votre disposition pour vous guider dans le choix de votre pièce idéale. Que ce soit pour un cadeau ou un investissement, nous vous accompagnons à chaque étape.",
  },
  {
    icon: Wrench,
    title: "Réparation",
    description: "Notre atelier de réparation certifié prend en charge l'entretien et la réparation de vos montres et bijoux. Changement de pile, révision complète, polissage — nos artisans redonnent vie à vos pièces.",
  },
  {
    icon: Gem,
    title: "Gravure",
    description: "Personnalisez vos bijoux et montres avec notre service de gravure. Initiales, dates, messages — rendez chaque pièce unique et mémorable avec une gravure sur mesure réalisée par nos artisans.",
  },
];

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <TopBar />
    <Navbar />

    <div className="relative h-[250px] md:h-[350px] overflow-hidden">
      <img src={catServices} alt="Services" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <h1 className="text-primary-foreground text-3xl md:text-5xl font-display font-bold tracking-wider mb-3">Nos Services</h1>
          <p className="text-primary-foreground/70 font-body text-sm max-w-lg mx-auto">Un service d'excellence pour accompagner votre expérience LuxuryMontre</p>
        </div>
      </div>
    </div>

    <div className="section-container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.title} className="border border-border p-8 hover:border-accent transition-colors duration-300">
            <service.icon className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-lg font-display font-bold tracking-wider mb-3">{service.title}</h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </div>
);

export default ServicesPage;
