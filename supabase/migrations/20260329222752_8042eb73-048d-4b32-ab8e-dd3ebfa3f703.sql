
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '/',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero slides" ON public.hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hero slides" ON public.hero_slides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.hero_slides (title, subtitle, description, link, sort_order) VALUES
  ('MONTRES DE LUXE', 'Collection Montres', 'Des montres d''exception alliant tradition horlogère et design contemporain.', '/categorie/montres', 0),
  ('BIJOUX D''EXCEPTION', 'Collection Bijoux', 'Bagues, bracelets et pièces uniques façonnées avec les matériaux les plus nobles.', '/categorie/bijoux', 1),
  ('ACCESSOIRES PREMIUM', 'Collection Accessoires', 'Lunettes, parfums, stylos et maroquinerie pour compléter votre style.', '/categorie/accessoires', 2);
