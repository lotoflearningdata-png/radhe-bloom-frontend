// Cloudinary delivery-URL transforms. Non-Cloudinary URLs pass through unchanged.
const transform = (url, t) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/${t}/`)
}

// Square thumbnail, smart-cropped around the main subject (for grids & small thumbs)
export const thumbUrl = (url, size = 600) =>
  transform(url, `w_${size},h_${size},c_fill,g_auto,f_auto,q_auto`)

// Full image fitted into a square, padded with a color sampled from the image itself
export const detailUrl = (url, size = 1000) =>
  transform(url, `w_${size},h_${size},c_pad,b_auto,f_auto,q_auto`)
