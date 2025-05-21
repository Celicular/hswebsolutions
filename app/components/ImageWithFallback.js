'use client';

import { useState } from 'react';
import Image from 'next/image';

const ImageWithFallback = ({ src, fallback = '/images/placeholder.svg', alt, ...props }) => {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallback : src}
      alt={alt}
      onError={() => setError(true)}
      quality={90}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

export default ImageWithFallback;
