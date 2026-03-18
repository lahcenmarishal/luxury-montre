import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight, Truck, Shield, CheckCircle } from "lucide-react";

const formatMAD = (amount: number) => `${amount.toLocaleString("fr-MA")} MAD`;

const cities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès",
  "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Mohammedia", "El Jadida",
  "Béni Mellal", "Settat", "Khouribga", "Taza", "Errachidia", "Laâyoune",
];

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const shippingCost = totalPrice >= 500 ? 0 : 30;
  const orderTotal = totalPrice + shippingCost;
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "Casablanca", zipCode: "",
    paymentMethod: "cod",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Navbar />
        <div className="section-container py-20 text-center max-w-lg mx-auto">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold tracking-wider mb-4">Commande confirmée !</h1>
          <p className="text-sm font-body text-muted-foreground mb-2">
            Merci pour votre commande. Vous recevrez un e-mail de confirmation avec les détails de votre livraison.
          </p>
          <p className="text-sm font-body text-muted-foreground mb-8">
            Notre équipe vous contactera au numéro fourni pour confirmer la livraison.
          </p>
          <Link to="/" className="btn-shop inline-block">RETOUR À L'ACCUEIL</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Navbar />
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Votre panier est vide</h2>
          <Link to="/" className="btn-shop inline-block">CONTINUER MES ACHATS</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      {/* Breadcrumb */}
      <div className="section-container py-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
        <Link to="/" className="hover:text-accent transition-colors">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Validation de commande</span>
      </div>

      <div className="section-container pb-16">
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider mb-8">Validation de commande</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-sm font-body font-bold tracking-[0.15em] uppercase mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-body text-muted-foreground block mb-1">Prénom *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground block mb-1">Nom *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground block mb-1">E-mail *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs font-body text-muted-foreground block mb-1">Téléphone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+212 6XX XXX XXX" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent" />
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div>
              <h2 className="text-sm font-body font-bold tracking-[0.15em] uppercase mb-4">Adresse de livraison</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-body text-muted-foreground block mb-1">Adresse complète *</label>
                  <input name="address" value={form.address} onChange={handleChange} required className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-body text-muted-foreground block mb-1">Ville *</label>
                    <select name="city" value={form.city} onChange={handleChange} required className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent">
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-body text-muted-foreground block mb-1">Code postal *</label>
                    <input name="zipCode" value={form.zipCode} onChange={handleChange} required className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mode de paiement */}
            <div>
              <h2 className="text-sm font-body font-bold tracking-[0.15em] uppercase mb-4">Mode de paiement</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border border-border p-4 cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === "cod"} onChange={handleChange} className="accent-foreground" />
                  <div>
                    <p className="text-sm font-body font-bold">Paiement à la livraison</p>
                    <p className="text-xs font-body text-muted-foreground">Payez en espèces à la réception de votre commande</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 border border-border p-4 cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === "card"} onChange={handleChange} className="accent-foreground" />
                  <div>
                    <p className="text-sm font-body font-bold">Carte bancaire</p>
                    <p className="text-xs font-body text-muted-foreground">Visa, Mastercard, CMI</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 border border-border p-4 cursor-pointer hover:border-accent transition-colors">
                  <input type="radio" name="paymentMethod" value="transfer" checked={form.paymentMethod === "transfer"} onChange={handleChange} className="accent-foreground" />
                  <div>
                    <p className="text-sm font-body font-bold">Virement bancaire</p>
                    <p className="text-xs font-body text-muted-foreground">Les détails vous seront envoyés par e-mail</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="border border-border p-6 sticky top-24">
              <h2 className="text-sm font-body font-bold tracking-[0.15em] uppercase mb-6">Récapitulatif</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-secondary flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-body truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{item.brand} × {item.quantity}</p>
                      <p className="text-xs font-body font-bold">{formatMAD(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatMAD(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>{shippingCost === 0 ? "Gratuite" : formatMAD(shippingCost)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-bold text-base">
                  <span>Total</span>
                  <span className="font-display">{formatMAD(orderTotal)}</span>
                </div>
              </div>

              <button type="submit" className="btn-shop w-full text-center text-xs mt-6">
                CONFIRMER LA COMMANDE
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-body text-muted-foreground">
                  <Truck className="w-4 h-4 text-foreground" />
                  <span>Livraison gratuite dès 500 MAD</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-body text-muted-foreground">
                  <Shield className="w-4 h-4 text-foreground" />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
