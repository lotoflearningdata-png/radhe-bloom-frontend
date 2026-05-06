import { Helmet } from 'react-helmet-async'

const DEFAULT = {
  title:       'Radhe Bloom – Divine Creations & Sacred Gifts',
  description: 'Handcrafted Krishna idols, MDF cutouts, devotional gifts & toys from Mathura. Serving retail & wholesale with love. Free shipping above ₹499.',
  image:       'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png',
  url:         'https://radhebloom.in',
}

export default function SEO({ title, description, image, url, type = 'website', product }) {
  const fullTitle  = title ? `${title} | Radhe Bloom` : DEFAULT.title
  const fullDesc   = description || DEFAULT.description
  const fullImage  = image || DEFAULT.image
  const fullUrl    = url || DEFAULT.url

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content="radhe bloom, krishna idol, radha krishna, MDF cutout, devotional gifts, mathura, janmashtami, navratri, hindu idol, handcrafted, wholesale" />
      <meta name="author" content="Radhe Bloom" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (Facebook, WhatsApp) */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:image"       content={fullImage} />
      <meta property="og:url"         content={fullUrl} />
      <meta property="og:site_name"   content="Radhe Bloom" />
      <meta property="og:locale"      content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image"       content={fullImage} />

      {/* Product structured data for Google */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context':        'https://schema.org',
            '@type':           'Product',
            name:              product.name,
            description:       product.description,
            image:             product.images?.[0] || fullImage,
            brand:             { '@type': 'Brand', name: 'Radhe Bloom' },
            offers: {
              '@type':       'Offer',
              price:         product.price,
              priceCurrency: 'INR',
              availability:  product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller:        { '@type': 'Organization', name: 'Radhe Bloom' },
            },
            aggregateRating: product.reviewCount > 0 ? {
              '@type':      'AggregateRating',
              ratingValue:  product.rating,
              reviewCount:  product.reviewCount,
            } : undefined,
          })}
        </script>
      )}

      {/* Business structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type':    'OnlineStore',
          name:       'Radhe Bloom',
          url:        'https://radhebloom.in',
          logo:       DEFAULT.image,
          description: DEFAULT.description,
          address: {
            '@type':          'PostalAddress',
            addressLocality:  'Mathura',
            addressRegion:    'Uttar Pradesh',
            addressCountry:   'IN',
          },
          contactPoint: {
            '@type':       'ContactPoint',
            telephone:     '+91-9528078217',
            contactType:   'customer service',
            areaServed:    'IN',
            availableLanguage: ['Hindi', 'English'],
          },
          sameAs: [
            'https://instagram.com/radhebloom',
            'https://facebook.com/radhebloom',
          ],
        })}
      </script>
    </Helmet>
  )
}