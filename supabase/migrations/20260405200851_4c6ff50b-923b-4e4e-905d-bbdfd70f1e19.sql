
CREATE TABLE public.brand_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(brand_id, slug)
);

ALTER TABLE public.brand_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active models"
  ON public.brand_models FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage models"
  ON public.brand_models FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_brand_models_updated_at
  BEFORE UPDATE ON public.brand_models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
