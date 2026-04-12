import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, any>;
}

const SITE_NAME = "LuxuryMontre";
const BASE_URL = "https://luxurymontre.ma";
const DEFAULT_IMAGE = "https://lovable.dev/opengraph-image-p98pqg.png";

const SEOHead = ({
  title,
  description = "Achetez des montres de luxe, bijoux et accessoires au Maroc. Glycine, Seiko, Fossil, Casio. Livraison partout au Maroc. Prix compétitifs et authenticité garantie.",
  keywords = "montre luxe maroc, montres homme maroc, montres femme maroc, bijoux maroc, accessoires luxe maroc, glycine montre, seiko maroc, fossil maroc, casio maroc, achat montre en ligne maroc, montre originale maroc",
  canonical,
  type = "website",
  image = DEFAULT_IMAGE,
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Montres, Bijoux & Accessoires de Luxe au Maroc`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="MA" />
      <meta name="geo.placename" content="Maroc" />
      <meta name="language" content="fr" />
      <meta name="content-language" content="fr-MA" />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_MA" />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
