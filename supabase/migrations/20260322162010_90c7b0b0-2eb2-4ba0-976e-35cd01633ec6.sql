
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'montres',
  display_in_menu boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active brands" ON public.brands
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage brands" ON public.brands
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed initial brands
INSERT INTO public.brands (name, slug, category) VALUES
  ('Glycine', 'glycine', 'montres'),
  ('Seiko', 'seiko', 'montres'),
  ('Fossil', 'fossil', 'montres'),
  ('Casio', 'casio', 'montres');
