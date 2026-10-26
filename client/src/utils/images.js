export const FALLBACK_HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

const BROKEN_PHOTO_REPLACEMENTS = {
  'photo-1584132966304-c76983e0b1c4':
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
};

export const resolveImageUrl = (src) => {
  if (!src || typeof src !== 'string') return FALLBACK_HOTEL_IMAGE;
  for (const [brokenId, replacement] of Object.entries(BROKEN_PHOTO_REPLACEMENTS)) {
    if (src.includes(brokenId)) return replacement;
  }
  return src;
};

export const resolveGallery = (images) => {
  const list = (images || []).map(resolveImageUrl).filter(Boolean);
  return list.length > 0 ? list : [FALLBACK_HOTEL_IMAGE];
};
