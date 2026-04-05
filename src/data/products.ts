// Product images imports
import watch1 from "@/assets/watch-1.png";
import watch2 from "@/assets/watch-2.png";
import watch3 from "@/assets/watch-3.png";
import watch4 from "@/assets/watch-4.png";
import watch5 from "@/assets/watch-5.png";
import watch6 from "@/assets/watch-6.png";
import watch7 from "@/assets/watch-7.png";
import watch8 from "@/assets/watch-8.png";
import watch1h from "@/assets/watch-1-hover.png";
import watch2h from "@/assets/watch-2-hover.png";
import watch3h from "@/assets/watch-3-hover.png";
import watch4h from "@/assets/watch-4-hover.png";
import watch5h from "@/assets/watch-5-hover.png";
import watch6h from "@/assets/watch-6-hover.png";
import watch7h from "@/assets/watch-7-hover.png";
import watch8h from "@/assets/watch-8-hover.png";
import ring2 from "@/assets/ring-2.png";
import ring3 from "@/assets/ring-3.png";
import bracelet1 from "@/assets/bracelet-1.png";
import bracelet2 from "@/assets/bracelet-2.png";
import glasses1 from "@/assets/glasses-1.png";
import glasses2 from "@/assets/glasses-2.png";
import sunglasses1 from "@/assets/sunglasses-1.png";
import sunglasses2 from "@/assets/sunglasses-2.png";
import perfume1 from "@/assets/perfume-1.png";
import perfume2 from "@/assets/perfume-2.png";
import pen1 from "@/assets/pen-1.png";
import pen2 from "@/assets/pen-2.png";
import briefcase1 from "@/assets/briefcase-1.png";
import briefcase2 from "@/assets/briefcase-2.png";
import wallet1 from "@/assets/wallet-1.png";
import wallet2 from "@/assets/wallet-2.png";
import backpack1 from "@/assets/backpack-1.png";
import backpack2 from "@/assets/backpack-2.png";

// Category images
import catBijoux from "@/assets/cat-bijoux.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import catServices from "@/assets/cat-services.jpg";
import catAntique from "@/assets/category-antique.jpg";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage: string;
  gallery: string[];
  category: string;
  subcategory: string;
  reference: string;
  gender?: "homme" | "femme" | "unisexe";
  badge?: { type: "hot" | "sale"; label: string };
  description: string;
  model?: string; // For Glycine watches
}

export interface Subcategory {
  slug: string;
  name: string;
  image: string;
}

export interface Category {
  slug: string;
  name: string;
  image: string;
  description: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    slug: "montres",
    name: "Montres",
    image: catAntique,
    description: "Découvrez notre collection de montres de luxe, alliant tradition horlogère et design contemporain.",
    subcategories: [
      { slug: "homme", name: "Homme", image: watch2 },
      { slug: "femme", name: "Femme", image: watch4 },
      { slug: "unisexe", name: "Unisexe", image: watch6 },
      { slug: "glycine", name: "Glycine", image: watch1 },
      { slug: "seiko", name: "Seiko", image: watch8 },
      { slug: "fossil", name: "Fossil", image: watch2 },
      { slug: "casio", name: "Casio", image: watch5 },
    ],
  },
  {
    slug: "bijoux",
    name: "Bijoux",
    image: catBijoux,
    description: "Des bijoux d'exception, façonnés avec les matériaux les plus nobles pour sublimer chaque instant.",
    subcategories: [
      { slug: "bagues", name: "Bagues", image: ring3 },
      { slug: "bracelets", name: "Bracelets", image: bracelet1 },
    ],
  },
  {
    slug: "accessoires",
    name: "Accessoires",
    image: catAccessories,
    description: "Complétez votre style avec nos accessoires de luxe soigneusement sélectionnés.",
    subcategories: [
      { slug: "lunettes-de-vue", name: "Lunettes de vue", image: glasses1 },
      { slug: "lunettes-de-soleil", name: "Lunettes de soleil", image: sunglasses2 },
      { slug: "parfum", name: "Parfum", image: perfume1 },
      { slug: "stylos", name: "Stylos", image: pen1 },
      { slug: "porte-documents", name: "Porte-documents", image: briefcase1 },
      { slug: "portefeuille", name: "Portefeuille", image: wallet1 },
      { slug: "sac-a-dos", name: "Sac à dos", image: backpack1 },
      { slug: "ceintures", name: "Ceintures", image: briefcase1 },
    ],
  },
  {
    slug: "services",
    name: "Services",
    image: catServices,
    description: "Un service d'excellence pour accompagner votre expérience LuxuryMontre.",
    subcategories: [
      { slug: "garantie", name: "Garantie", image: catServices },
      { slug: "conseils", name: "Conseils personnalisés", image: catServices },
    ],
  },
];

export const products: Product[] = [
  // MONTRES - Glycine (with models and references)
  { id: "m1", name: "Glycine Combat Sub", brand: "Glycine", price: 4500, oldPrice: 5200, image: watch1, hoverImage: watch1h, gallery: [watch1, watch1h], category: "montres", subcategory: "glycine", reference: "GL-CS-001", gender: "homme", model: "Combat Sub", badge: { type: "sale", label: "13% Off" }, description: "Montre de plongée Glycine Combat Sub avec cadran vert émeraude et bracelet en acier inoxydable." },
  { id: "m2", name: "Glycine Airman", brand: "Glycine", price: 5800, image: watch3, hoverImage: watch3h, gallery: [watch3, watch3h], category: "montres", subcategory: "glycine", reference: "GL-AM-002", gender: "homme", model: "Airman", badge: { type: "hot", label: "NEW" }, description: "Montre aviateur Glycine Airman avec cadran bleu profond et fonction GMT." },
  { id: "m3", name: "Glycine Classic", brand: "Glycine", price: 3200, image: watch6, hoverImage: watch6h, gallery: [watch6, watch6h], category: "montres", subcategory: "glycine", reference: "GL-CL-003", gender: "unisexe", model: "Classic", description: "Montre classique Glycine avec cadran argenté et bracelet maille milanaise." },
  { id: "m15", name: "Glycine Combat Sub Moonlight", brand: "Glycine", price: 4800, image: watch7, hoverImage: watch7h, gallery: [watch7, watch7h], category: "montres", subcategory: "glycine", reference: "GL-CSM-015", gender: "homme", model: "Combat Sub", description: "Combat Sub édition Moonlight avec cadran noir lumineux et lunette bleue." },
  { id: "m16", name: "Glycine Airman GMT", brand: "Glycine", price: 6200, oldPrice: 7000, image: watch5, hoverImage: watch5h, gallery: [watch5, watch5h], category: "montres", subcategory: "glycine", reference: "GL-AGMT-016", gender: "homme", model: "Airman", badge: { type: "sale", label: "11% Off" }, description: "Glycine Airman GMT avec double fuseau horaire et bracelet NATO." },
  { id: "m17", name: "Glycine Airman Vintage", brand: "Glycine", price: 5500, image: watch2, hoverImage: watch2h, gallery: [watch2, watch2h], category: "montres", subcategory: "glycine", reference: "GL-AV-017", gender: "homme", model: "Airman", badge: { type: "hot", label: "HOT" }, description: "Réédition vintage de l'Airman originale avec cadran crème patiné." },
  { id: "m18", name: "Glycine Classic Prestige", brand: "Glycine", price: 3600, image: watch4, hoverImage: watch4h, gallery: [watch4, watch4h], category: "montres", subcategory: "glycine", reference: "GL-CP-018", gender: "femme", model: "Classic", badge: { type: "hot", label: "NEW" }, description: "Glycine Classic Prestige en or rose avec bracelet cuir bordeaux." },
  { id: "m19", name: "Glycine Combat 6 Classic", brand: "Glycine", price: 3900, image: watch8, hoverImage: watch8h, gallery: [watch8, watch8h], category: "montres", subcategory: "glycine", reference: "GL-C6C-019", gender: "homme", model: "Combat 6", description: "Combat 6 Classic avec cadran blanc et aiguilles bleuies, mouvement automatique." },
  { id: "m20", name: "Glycine Combat 6 Vintage", brand: "Glycine", price: 4100, oldPrice: 4600, image: watch6, hoverImage: watch6h, gallery: [watch6, watch6h], category: "montres", subcategory: "glycine", reference: "GL-C6V-020", gender: "homme", model: "Combat 6", badge: { type: "sale", label: "11% Off" }, description: "Combat 6 édition Vintage avec finition vieillie et bracelet en cuir vieilli." },

  // MONTRES - Seiko
  { id: "m4", name: "Seiko Prestige Black", brand: "Seiko", price: 1900, oldPrice: 2200, image: watch8, hoverImage: watch8h, gallery: [watch8, watch8h], category: "montres", subcategory: "seiko", reference: "SK-PB-004", gender: "homme", badge: { type: "hot", label: "HOT" }, description: "Montre Seiko avec cadran noir et boîtier en or, un classique intemporel." },
  { id: "m5", name: "Seiko Presage Femme", brand: "Seiko", price: 2400, image: watch4, hoverImage: watch4h, gallery: [watch4, watch4h], category: "montres", subcategory: "seiko", reference: "SK-PF-005", gender: "femme", badge: { type: "hot", label: "NEW" }, description: "Montre Seiko Presage pour femme en or rose avec bracelet maille milanaise." },

  // MONTRES - Fossil
  { id: "m6", name: "Fossil 3-Hand Sports", brand: "Fossil", price: 2990, oldPrice: 3450, image: watch2, hoverImage: watch2h, gallery: [watch2, watch2h], category: "montres", subcategory: "fossil", reference: "FS-3H-006", gender: "homme", badge: { type: "hot", label: "HOT" }, description: "Montre sport Fossil avec chronographe intégré et bracelet en acier inoxydable." },
  { id: "m7", name: "Fossil Heritage Femme", brand: "Fossil", price: 1800, image: watch5, hoverImage: watch5h, gallery: [watch5, watch5h], category: "montres", subcategory: "fossil", reference: "FS-HF-007", gender: "femme", description: "Montre vintage Fossil avec cadran doré et bracelet en cuir marron." },

  // MONTRES - Casio
  { id: "m8", name: "Casio Edifice Chrono", brand: "Casio", price: 1450, oldPrice: 1800, image: watch7, hoverImage: watch7h, gallery: [watch7, watch7h], category: "montres", subcategory: "casio", reference: "CS-EC-008", gender: "homme", badge: { type: "sale", label: "19% Off" }, description: "Chronographe Casio Edifice en acier avec cadran noir, robuste et élégant." },

  // BIJOUX - Bagues
  { id: "b1", name: "Chevalière Royale", brand: "Cartier", price: 4500, image: ring2, hoverImage: ring2, gallery: [ring2], category: "bijoux", subcategory: "bagues", reference: "CT-CR-101", description: "Chevalière en argent sterling avec motifs gravés et pierres précieuses bleues." },
  { id: "b2", name: "Solitaire Éternité", brand: "Tiffany", price: 12000, oldPrice: 15000, image: ring3, hoverImage: ring3, gallery: [ring3], category: "bijoux", subcategory: "bagues", reference: "TF-SE-102", badge: { type: "sale", label: "20% Off" }, description: "Bague solitaire en or 18 carats avec diamant taille brillant de 1 carat." },
  // BIJOUX - Bracelets
  { id: "b3", name: "Chaîne Cubaine Or", brand: "Bulgari", price: 6800, image: bracelet1, hoverImage: bracelet1, gallery: [bracelet1], category: "bijoux", subcategory: "bracelets", reference: "BG-CC-103", badge: { type: "hot", label: "HOT" }, description: "Bracelet chaîne cubaine en or 18 carats, un classique de la joaillerie masculine." },
  { id: "b4", name: "Diamants Entrelacés", brand: "Cartier", price: 9200, image: bracelet2, hoverImage: bracelet2, gallery: [bracelet2], category: "bijoux", subcategory: "bracelets", reference: "CT-DE-104", badge: { type: "hot", label: "NEW" }, description: "Bracelet en argent serti de diamants avec motif entrelacé, raffinement féminin." },

  // ACCESSOIRES
  { id: "a1", name: "Écaille Classique", brand: "Tom Ford", price: 3200, image: glasses1, hoverImage: glasses1, gallery: [glasses1], category: "accessoires", subcategory: "lunettes-de-vue", reference: "TF-EC-201", description: "Lunettes de vue Tom Ford monture écaille, style intellectuel chic." },
  { id: "a2", name: "Noire Élégance", brand: "Prada", price: 2800, oldPrice: 3500, image: glasses2, hoverImage: glasses2, gallery: [glasses2], category: "accessoires", subcategory: "lunettes-de-vue", reference: "PR-NE-202", badge: { type: "sale", label: "20% Off" }, description: "Lunettes Prada monture noire fine, élégance contemporaine." },
  { id: "a3", name: "Round Gold", brand: "Ray-Ban", price: 2500, image: sunglasses1, hoverImage: sunglasses1, gallery: [sunglasses1], category: "accessoires", subcategory: "lunettes-de-soleil", reference: "RB-RG-203", badge: { type: "hot", label: "HOT" }, description: "Lunettes de soleil rondes Ray-Ban avec monture dorée et verres polarisés." },
  { id: "a4", name: "Wayfarer Noir", brand: "Persol", price: 2200, image: sunglasses2, hoverImage: sunglasses2, gallery: [sunglasses2], category: "accessoires", subcategory: "lunettes-de-soleil", reference: "PS-WN-204", description: "Lunettes de soleil Persol style wayfarer, un incontournable du style." },
  { id: "a5", name: "Noir Absolu", brand: "Tom Ford", price: 1800, image: perfume1, hoverImage: perfume1, gallery: [perfume1], category: "accessoires", subcategory: "parfum", reference: "TF-NA-205", gender: "homme", badge: { type: "hot", label: "HOT" }, description: "Eau de parfum Tom Ford aux notes boisées et épicées, un parfum puissant et sophistiqué." },
  { id: "a6", name: "Rose Éclat", brand: "Chanel", price: 2100, image: perfume2, hoverImage: perfume2, gallery: [perfume2], category: "accessoires", subcategory: "parfum", reference: "CH-RE-206", gender: "femme", badge: { type: "hot", label: "NEW" }, description: "Eau de parfum aux notes florales délicates avec un sillage envoûtant." },
  { id: "a7", name: "Plume Présidence", brand: "Montblanc", price: 4500, image: pen1, hoverImage: pen1, gallery: [pen1], category: "accessoires", subcategory: "stylos", reference: "MB-PP-207", badge: { type: "hot", label: "HOT" }, description: "Stylo plume Montblanc avec plume en or 18 carats et corps en laque noire." },
  { id: "a8", name: "Chrome Executive", brand: "Cross", price: 1200, image: pen2, hoverImage: pen2, gallery: [pen2], category: "accessoires", subcategory: "stylos", reference: "CR-CE-208", description: "Stylo bille Cross en chrome poli, un compagnon d'écriture élégant." },
  { id: "a9", name: "Attaché Classique", brand: "Montblanc", price: 8900, image: briefcase1, hoverImage: briefcase1, gallery: [briefcase1], category: "accessoires", subcategory: "porte-documents", reference: "MB-AC-209", badge: { type: "hot", label: "HOT" }, description: "Porte-documents Montblanc en cuir pleine fleur avec fermoir doré." },
  { id: "a10", name: "Slim Business", brand: "Hugo Boss", price: 4500, image: briefcase2, hoverImage: briefcase2, gallery: [briefcase2], category: "accessoires", subcategory: "porte-documents", reference: "HB-SB-210", description: "Sacoche business Hugo Boss en cuir noir, design épuré et fonctionnel." },
  { id: "a11", name: "Card Holder Noir", brand: "Prada", price: 2200, image: wallet1, hoverImage: wallet1, gallery: [wallet1], category: "accessoires", subcategory: "portefeuille", reference: "PR-CH-211", description: "Porte-cartes Prada en cuir Saffiano noir, compact et élégant." },
  { id: "a12", name: "Bifold Cognac", brand: "Berluti", price: 3800, image: wallet2, hoverImage: wallet2, gallery: [wallet2], category: "accessoires", subcategory: "portefeuille", reference: "BL-BC-212", badge: { type: "hot", label: "NEW" }, description: "Portefeuille Berluti en cuir patiné couleur cognac, artisanat d'exception." },
  { id: "a13", name: "Urban Explorer", brand: "Montblanc", price: 6500, image: backpack1, hoverImage: backpack1, gallery: [backpack1], category: "accessoires", subcategory: "sac-a-dos", reference: "MB-UE-213", description: "Sac à dos Montblanc en cuir marron, parfait pour le professionnel moderne." },
  { id: "a14", name: "City Noir", brand: "Gucci", price: 7800, image: backpack2, hoverImage: backpack2, gallery: [backpack2], category: "accessoires", subcategory: "sac-a-dos", reference: "GC-CN-214", badge: { type: "hot", label: "HOT" }, description: "Sac à dos Gucci en cuir noir avec fermetures éclair dorées." },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): Product[] {
  // For brand-based subcategories in montres, filter by brand name
  const brandSubcategories = ["glycine", "seiko", "fossil", "casio"];
  if (categorySlug === "montres" && brandSubcategories.includes(subcategorySlug)) {
    return products.filter((p) => p.category === "montres" && p.brand.toLowerCase() === subcategorySlug);
  }
  // For gender subcategories
  if (categorySlug === "montres" && (subcategorySlug === "homme" || subcategorySlug === "femme")) {
    return products.filter((p) => p.category === "montres" && p.gender === subcategorySlug);
  }
  return products.filter((p) => p.category === categorySlug && p.subcategory === subcategorySlug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getGlycineModels(): string[] {
  const glycineProducts = products.filter((p) => p.brand === "Glycine" && p.model);
  return [...new Set(glycineProducts.map((p) => p.model!))];
}

export function getProductsByModel(model: string): Product[] {
  return products.filter((p) => p.brand === "Glycine" && p.model === model);
}
