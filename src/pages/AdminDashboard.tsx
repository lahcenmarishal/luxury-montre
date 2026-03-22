import { useAdmin } from "@/hooks/useAdmin";
import { useState, useEffect } from "react";
import { Package, ShoppingCart, BarChart3, LogOut, Plus, Pencil, Trash2, Eye, ArrowLeft, X, ImagePlus, Settings, Menu, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

type Tab = "overview" | "products" | "orders" | "brands" | "settings";

interface ProductForm {
  name: string; brand: string; price: string; old_price: string;
  category: string; subcategory: string; reference: string;
  gender: string; badge_type: string; badge_label: string;
  description: string; model: string; stock: string; is_active: boolean;
}

const emptyForm: ProductForm = {
  name: "", brand: "", price: "", old_price: "",
  category: "", subcategory: "", reference: "",
  gender: "", badge_type: "", badge_label: "",
  description: "", model: "", stock: "0", is_active: true,
};

interface BrandForm {
  name: string; slug: string; category: string; display_in_menu: boolean; is_active: boolean;
}

const emptyBrandForm: BrandForm = { name: "", slug: "", category: "montres", display_in_menu: true, is_active: true };

const subcategoryOptions: Record<string, { value: string; label: string }[]> = {
  montres: [
    { value: "homme", label: "Homme" },
    { value: "femme", label: "Femme" },
    { value: "glycine", label: "Glycine" },
    { value: "seiko", label: "Seiko" },
    { value: "fossil", label: "Fossil" },
    { value: "casio", label: "Casio" },
  ],
  bijoux: [
    { value: "bagues", label: "Bagues" },
    { value: "bracelets", label: "Bracelets" },
  ],
  accessoires: [
    { value: "lunettes-de-vue", label: "Lunettes de vue" },
    { value: "lunettes-de-soleil", label: "Lunettes de soleil" },
    { value: "parfum", label: "Parfum" },
    { value: "stylos", label: "Stylos" },
    { value: "porte-documents", label: "Porte-documents" },
    { value: "portefeuille", label: "Portefeuille" },
    { value: "sac-a-dos", label: "Sac à dos" },
  ],
};

const AdminDashboard = () => {
  const { isAdmin, loading, signOut } = useAdmin();
  const [tab, setTab] = useState<Tab>("overview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [socialLinks, setSocialLinks] = useState({ whatsapp: "", instagram: "", facebook: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Brand state
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [brandForm, setBrandForm] = useState<BrandForm>(emptyBrandForm);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  useEffect(() => {
    if (!isAdmin) return;
    const loadSettings = async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r: any) => { map[r.key] = r.value; });
        setSocialLinks({ whatsapp: map.whatsapp || "", instagram: map.instagram || "", facebook: map.facebook || "" });
      }
    };
    loadSettings();
  }, [isAdmin]);

  const saveSocialLinks = async () => {
    setSavingSettings(true);
    try {
      for (const [key, value] of Object.entries(socialLinks)) {
        await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
      }
      toast({ title: "Coordonnées mises à jour" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setSavingSettings(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let image_url: string | undefined;
      let hover_image_url: string | undefined;
      let galleryUrls: string[] = [];
      if (imageFile) image_url = await uploadImage(imageFile);
      if (hoverImageFile) hover_image_url = await uploadImage(hoverImageFile);
      if (galleryFiles.length > 0) galleryUrls = await Promise.all(galleryFiles.map(f => uploadImage(f)));

      const payload: Record<string, unknown> = {
        name: form.name, brand: form.brand,
        price: parseFloat(form.price),
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        category: form.category, subcategory: form.subcategory,
        reference: form.reference, gender: form.gender || null,
        badge_type: form.badge_type || null, badge_label: form.badge_label || null,
        description: form.description, model: form.model || null,
        stock: parseInt(form.stock) || 0, is_active: form.is_active,
      };
      if (image_url) payload.image_url = image_url;
      if (hover_image_url) payload.hover_image_url = hover_image_url;
      if (galleryUrls.length > 0) {
        if (editingId) {
          const existing = products.find((p: any) => p.id === editingId);
          payload.gallery = [...(existing?.gallery || []), ...galleryUrls];
        } else {
          payload.gallery = galleryUrls;
        }
      }
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false); setForm(emptyForm); setEditingId(null);
      setImageFile(null); setHoverImageFile(null); setGalleryFiles([]);
      toast({ title: editingId ? "Produit modifié" : "Produit ajouté" });
    },
    onError: (err: Error) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Produit supprimé" });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Statut mis à jour" });
    },
  });

  // Brand mutations
  const saveBrandMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: brandForm.name,
        slug: brandForm.slug,
        category: brandForm.category,
        display_in_menu: brandForm.display_in_menu,
        is_active: brandForm.is_active,
      };
      if (editingBrandId) {
        const { error } = await supabase.from("brands").update(payload).eq("id", editingBrandId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("brands").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      queryClient.invalidateQueries({ queryKey: ["nav-brands"] });
      setBrandDialogOpen(false); setBrandForm(emptyBrandForm); setEditingBrandId(null);
      toast({ title: editingBrandId ? "Marque modifiée" : "Marque ajoutée" });
    },
    onError: (err: Error) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      queryClient.invalidateQueries({ queryKey: ["nav-brands"] });
      toast({ title: "Marque supprimée" });
    },
  });

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name, brand: product.brand,
      price: String(product.price), old_price: product.old_price ? String(product.old_price) : "",
      category: product.category, subcategory: product.subcategory,
      reference: product.reference, gender: product.gender || "",
      badge_type: product.badge_type || "", badge_label: product.badge_label || "",
      description: product.description || "", model: product.model || "",
      stock: String(product.stock ?? 0), is_active: product.is_active ?? true,
    });
    setImageFile(null); setHoverImageFile(null); setGalleryFiles([]);
    setDialogOpen(true);
  };

  const openBrandEdit = (brand: any) => {
    setEditingBrandId(brand.id);
    setBrandForm({
      name: brand.name, slug: brand.slug, category: brand.category,
      display_in_menu: brand.display_in_menu, is_active: brand.is_active,
    });
    setBrandDialogOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement...</div>;
  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const tabs = [
    { id: "overview" as Tab, label: "Vue d'ensemble", icon: BarChart3 },
    { id: "products" as Tab, label: "Produits", icon: Package },
    { id: "brands" as Tab, label: "Marques", icon: Tag },
    { id: "orders" as Tab, label: "Commandes", icon: ShoppingCart },
    { id: "settings" as Tab, label: "Paramètres", icon: Settings },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const currentSubcategories = subcategoryOptions[form.category] || [];

  const handleTabClick = (id: Tab) => { setTab(id); setSidebarOpen(false); };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary text-primary-foreground z-50 flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <h1 className="font-display text-lg font-bold tracking-wider">LuxuryMontre</h1>
        <span className="text-xs font-body text-primary-foreground/60">Admin</span>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-foreground/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-64 bg-primary text-primary-foreground flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-primary-foreground/10">
          <h1 className="font-display text-xl font-bold tracking-wider">LuxuryMontre</h1>
          <p className="text-xs text-primary-foreground/60 mt-1 font-body">Administration</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => handleTabClick(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body rounded transition-colors ${tab === t.id ? "bg-primary-foreground/10 text-primary-foreground" : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-primary-foreground/10 space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au site
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">Vue d'ensemble</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {[
                { label: "Produits", value: products.length, icon: Package },
                { label: "Commandes", value: orders.length, icon: ShoppingCart },
                { label: "En attente", value: pendingOrders, icon: ShoppingCart },
                { label: "Revenu total", value: `${totalRevenue.toLocaleString()} MAD`, icon: BarChart3 },
              ].map(card => (
                <div key={card.label} className="bg-background border border-border p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground font-body">{card.label}</span>
                    <card.icon className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  </div>
                  <p className="text-lg sm:text-2xl font-display font-bold text-foreground">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-background border border-border p-4 sm:p-6">
              <h3 className="text-lg font-display font-semibold mb-4">Dernières commandes</h3>
              {orders.slice(0, 5).length === 0 ? (
                <p className="text-muted-foreground text-sm font-body">Aucune commande pour le moment.</p>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Client</TableHead><TableHead>Total</TableHead><TableHead>Statut</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {orders.slice(0, 5).map(o => (
                        <TableRow key={o.id}>
                          <TableCell className="font-body text-xs sm:text-sm">{o.customer_name}</TableCell>
                          <TableCell className="font-body text-xs sm:text-sm">{Number(o.total).toLocaleString()} MAD</TableCell>
                          <TableCell><span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-body ${statusColors[o.status] || ""}`}>{o.status}</span></TableCell>
                          <TableCell className="text-sm text-muted-foreground font-body hidden sm:table-cell">{new Date(o.created_at!).toLocaleDateString("fr-FR")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Produits</h2>
              <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingId(null); setForm(emptyForm); setGalleryFiles([]); } }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs sm:text-sm"><Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Ajouter un produit</span><span className="sm:hidden">Ajouter</span></Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
                  <DialogHeader><DialogTitle>{editingId ? "Modifier le produit" : "Nouveau produit"}</DialogTitle></DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nom *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="space-y-2">
                      <Label>Marque *</Label>
                      <Select value={form.brand} onValueChange={v => setForm({ ...form, brand: v })}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner une marque" /></SelectTrigger>
                        <SelectContent>
                          {brands.map((b: any) => (
                            <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Prix *</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>Ancien prix</Label><Input type="number" value={form.old_price} onChange={e => setForm({ ...form, old_price: e.target.value })} /></div>
                    <div className="space-y-2">
                      <Label>Catégorie *</Label>
                      <Select value={form.category} onValueChange={v => setForm({ ...form, category: v, subcategory: "" })}>
                        <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="montres">Montres</SelectItem>
                          <SelectItem value="bijoux">Bijoux</SelectItem>
                          <SelectItem value="accessoires">Accessoires</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sous-catégorie *</Label>
                      <Select value={form.subcategory} onValueChange={v => setForm({ ...form, subcategory: v })} disabled={!form.category}>
                        <SelectTrigger><SelectValue placeholder="Sous-catégorie" /></SelectTrigger>
                        <SelectContent>
                          {currentSubcategories.map(sc => (<SelectItem key={sc.value} value={sc.value}>{sc.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Référence *</Label><Input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} required /></div>
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                        <SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homme">Homme</SelectItem>
                          <SelectItem value="femme">Femme</SelectItem>
                          <SelectItem value="unisexe">Unisexe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Modèle</Label><Input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
                    <div className="space-y-2">
                      <Label>Badge type</Label>
                      <Select value={form.badge_type} onValueChange={v => setForm({ ...form, badge_type: v })}>
                        <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hot">HOT</SelectItem>
                          <SelectItem value="sale">SALE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Badge label</Label><Input value={form.badge_label} onChange={e => setForm({ ...form, badge_label: e.target.value })} /></div>
                    <div className="col-span-1 sm:col-span-2 space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                    <div className="space-y-2"><Label>Image principale</Label><Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} /></div>
                    <div className="space-y-2"><Label>Image hover</Label><Input type="file" accept="image/*" onChange={e => setHoverImageFile(e.target.files?.[0] || null)} /></div>
                    <div className="col-span-1 sm:col-span-2 space-y-2">
                      <Label className="flex items-center gap-2"><ImagePlus className="w-4 h-4" /> Galerie d'images</Label>
                      <Input type="file" accept="image/*" multiple onChange={e => setGalleryFiles(Array.from(e.target.files || []))} />
                      {galleryFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {galleryFiles.map((f, i) => (
                            <div key={i} className="relative">
                              <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover border border-border" />
                              <button type="button" onClick={() => setGalleryFiles(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><X className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      {editingId && (() => {
                        const existing = products.find((p: any) => p.id === editingId);
                        const existingGallery = existing?.gallery || [];
                        if (existingGallery.length === 0) return null;
                        return (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Images existantes :</p>
                            <div className="flex flex-wrap gap-2">
                              {existingGallery.map((url: string, i: number) => (<img key={i} src={url} alt="" className="w-16 h-16 object-cover border border-border" />))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                      <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-background border border-border">
              {products.length === 0 ? (
                <p className="p-8 text-center text-muted-foreground font-body">Aucun produit. Commencez par en ajouter un.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Image</TableHead><TableHead>Nom</TableHead>
                      <TableHead className="hidden sm:table-cell">Marque</TableHead><TableHead>Prix</TableHead>
                      <TableHead className="hidden md:table-cell">Stock</TableHead><TableHead className="hidden sm:table-cell">Statut</TableHead><TableHead>Actions</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {products.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.image_url ? <img src={p.image_url} alt={p.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover" /> : <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted flex items-center justify-center text-[10px] text-muted-foreground">N/A</div>}</TableCell>
                          <TableCell className="font-body font-medium text-xs sm:text-sm max-w-[120px] truncate">{p.name}</TableCell>
                          <TableCell className="font-body text-muted-foreground hidden sm:table-cell">{p.brand}</TableCell>
                          <TableCell className="font-body text-xs sm:text-sm whitespace-nowrap">{Number(p.price).toLocaleString()} MAD</TableCell>
                          <TableCell className="font-body hidden md:table-cell">{p.stock}</TableCell>
                          <TableCell className="hidden sm:table-cell"><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Actif" : "Inactif"}</Badge></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => openEdit(p)} title="Modifier"><Pencil className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => { if (confirm("Supprimer ce produit ?")) deleteMutation.mutate(p.id); }} title="Supprimer"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BRANDS */}
        {tab === "brands" && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Marques</h2>
              <Dialog open={brandDialogOpen} onOpenChange={(open) => { setBrandDialogOpen(open); if (!open) { setEditingBrandId(null); setBrandForm(emptyBrandForm); } }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs sm:text-sm"><Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Ajouter une marque</span><span className="sm:hidden">Ajouter</span></Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-2">
                  <DialogHeader><DialogTitle>{editingBrandId ? "Modifier la marque" : "Nouvelle marque"}</DialogTitle></DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); saveBrandMutation.mutate(); }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom *</Label>
                      <Input value={brandForm.name} onChange={e => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        setBrandForm({ ...brandForm, name, slug });
                      }} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input value={brandForm.slug} onChange={e => setBrandForm({ ...brandForm, slug: e.target.value })} required />
                      <p className="text-xs text-muted-foreground">Utilisé dans les URLs (ex: glycine, seiko)</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Catégorie *</Label>
                      <Select value={brandForm.category} onValueChange={v => setBrandForm({ ...brandForm, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="montres">Montres</SelectItem>
                          <SelectItem value="bijoux">Bijoux</SelectItem>
                          <SelectItem value="accessoires">Accessoires</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Afficher dans le menu</Label>
                      <Switch checked={brandForm.display_in_menu} onCheckedChange={v => setBrandForm({ ...brandForm, display_in_menu: v })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Active</Label>
                      <Switch checked={brandForm.is_active} onCheckedChange={v => setBrandForm({ ...brandForm, is_active: v })} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setBrandDialogOpen(false)}>Annuler</Button>
                      <Button type="submit" disabled={saveBrandMutation.isPending}>{saveBrandMutation.isPending ? "Enregistrement..." : editingBrandId ? "Modifier" : "Ajouter"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-4">Les marques actives avec "Afficher dans le menu" apparaîtront dans la navigation du site.</p>
            <div className="bg-background border border-border">
              {brands.length === 0 ? (
                <p className="p-8 text-center text-muted-foreground font-body">Aucune marque. Commencez par en ajouter une.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Nom</TableHead><TableHead>Slug</TableHead>
                      <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                      <TableHead>Menu</TableHead><TableHead>Statut</TableHead><TableHead>Actions</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {brands.map((b: any) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-body font-medium">{b.name}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{b.slug}</TableCell>
                          <TableCell className="font-body hidden sm:table-cell capitalize">{b.category}</TableCell>
                          <TableCell>{b.display_in_menu ? <Badge>Oui</Badge> : <Badge variant="secondary">Non</Badge>}</TableCell>
                          <TableCell><Badge variant={b.is_active ? "default" : "secondary"}>{b.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => openBrandEdit(b)} title="Modifier"><Pencil className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => { if (confirm("Supprimer cette marque ?")) deleteBrandMutation.mutate(b.id); }} title="Supprimer"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">Commandes</h2>
            <div className="bg-background border border-border">
              {orders.length === 0 ? (
                <p className="p-8 text-center text-muted-foreground font-body">Aucune commande pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Client</TableHead><TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Téléphone</TableHead><TableHead className="hidden sm:table-cell">Ville</TableHead>
                      <TableHead>Total</TableHead><TableHead>Statut</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead><TableHead>Actions</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {orders.map((o: any) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-body font-medium text-xs sm:text-sm">{o.customer_name}</TableCell>
                          <TableCell className="font-body text-sm hidden md:table-cell">{o.customer_email}</TableCell>
                          <TableCell className="font-body text-sm hidden lg:table-cell">{o.customer_phone || "—"}</TableCell>
                          <TableCell className="font-body text-sm hidden sm:table-cell">{o.city || "—"}</TableCell>
                          <TableCell className="font-body text-xs sm:text-sm whitespace-nowrap">{Number(o.total).toLocaleString()} MAD</TableCell>
                          <TableCell>
                            <Select value={o.status} onValueChange={status => updateOrderStatus.mutate({ id: o.id, status })}>
                              <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="confirmed">Confirmée</SelectItem>
                                <SelectItem value="shipped">Expédiée</SelectItem>
                                <SelectItem value="delivered">Livrée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-body hidden sm:table-cell">{new Date(o.created_at!).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild><Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button></DialogTrigger>
                              <DialogContent className="mx-2">
                                <DialogHeader><DialogTitle>Détails de la commande</DialogTitle></DialogHeader>
                                <div className="space-y-3 text-sm font-body">
                                  <p><strong>Client:</strong> {o.customer_name}</p>
                                  <p><strong>Email:</strong> {o.customer_email}</p>
                                  <p><strong>Téléphone:</strong> {o.customer_phone || "—"}</p>
                                  <p><strong>Ville:</strong> {o.city || "—"}</p>
                                  <p><strong>Adresse:</strong> {o.shipping_address}</p>
                                  <p><strong>Articles:</strong></p>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {(o.items as any[])?.map((item: any, i: number) => (
                                      <li key={i}>{item.name} × {item.quantity} — {Number(item.price).toLocaleString()} MAD</li>
                                    ))}
                                  </ul>
                                  <p className="font-bold text-base">Total: {Number(o.total).toLocaleString()} MAD</p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6">Paramètres</h2>
            <div className="bg-background border border-border p-4 sm:p-6 max-w-lg">
              <h3 className="text-lg font-display font-semibold mb-4">Réseaux sociaux & Contact</h3>
              <p className="text-sm text-muted-foreground font-body mb-6">Ces liens seront affichés dans le pied de page du site.</p>
              <div className="space-y-4">
                <div className="space-y-2"><Label className="font-body">WhatsApp (numéro ou lien)</Label><Input placeholder="Ex: +212600000000" value={socialLinks.whatsapp} onChange={e => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))} /></div>
                <div className="space-y-2"><Label className="font-body">Instagram (lien du profil)</Label><Input placeholder="Ex: https://instagram.com/votre_compte" value={socialLinks.instagram} onChange={e => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))} /></div>
                <div className="space-y-2"><Label className="font-body">Facebook (lien de la page)</Label><Input placeholder="Ex: https://facebook.com/votre_page" value={socialLinks.facebook} onChange={e => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))} /></div>
                <Button onClick={saveSocialLinks} disabled={savingSettings} className="mt-4">{savingSettings ? "Enregistrement..." : "Enregistrer"}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
