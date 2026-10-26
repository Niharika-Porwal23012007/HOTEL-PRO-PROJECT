export const FALLBACK_HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

const BROKEN_PHOTO_REPLACEMENTS = {
  'photo-1584132966304-c76983e0b1c4':
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
};

export const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return FALLBACK_HOTEL_IMAGE;
  for (const [brokenId, replacement] of Object.entries(BROKEN_PHOTO_REPLACEMENTS)) {
    if (url.includes(brokenId)) return replacement;
  }
  return url;
};

export const sanitizeImages = (images = []) => images.map(sanitizeImageUrl);

export const sanitizeHotel = (hotel) => {
  if (!hotel) return hotel;
  return {
    ...hotel,
    images: sanitizeImages(hotel.images || []),
  };
};
