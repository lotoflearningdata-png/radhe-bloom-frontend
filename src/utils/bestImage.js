// Picks a representative "hero" image for a group of products — prefers a
// real Cloudinary product photo over the logo/placeholder fallback, then
// falls back to higher-rated products.
function score(product) {
  const img = product.images?.[0]
  if (!img) return -1
  if (img.includes('res.cloudinary.com') &&
      !img.includes('Radhe_Image_Logo') &&
      !img.includes('Radhe_Bloom') &&
      !img.includes('placehold') &&
      !img.includes('placeholder')) return 3
  if (img.includes('res.cloudinary.com')) return 2
  if (img.includes('placehold') || img.includes('placeholder')) return 1
  return 0
}

export function bestProductImage(products = []) {
  const sorted = [...products].sort((a, b) => {
    const diff = score(b) - score(a)
    return diff !== 0 ? diff : (b.rating || 0) - (a.rating || 0)
  })
  return sorted[0]?.images?.[0] || null
}
