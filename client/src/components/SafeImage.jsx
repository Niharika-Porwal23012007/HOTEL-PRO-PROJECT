import React, { useState } from 'react';
import { FALLBACK_HOTEL_IMAGE, resolveImageUrl } from '../utils/images';

export const SafeImage = ({ src, alt, className, ...props }) => {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? FALLBACK_HOTEL_IMAGE : resolveImageUrl(src);

  return (
    <img
      {...props}
      src={resolved}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};
