'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Emoji shown in place of the image when the source fails to load. */
  fallbackEmoji?: string;
}

/**
 * Plain `<img>` with a graceful failure state. Several catalogue images point at
 * remote URLs that can 404, which previously left raw alt text in the layout.
 * Next's `<Image>` is deliberately avoided: sources include camera data URLs.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackEmoji = '🌿',
}) => {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const checkLoaded = useCallback(() => {
    const img = imgRef.current;
    // A finished load with no intrinsic width means the request failed. This
    // catches server-rendered images that error before React hydrates, when the
    // onError handler is not attached yet.
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  useEffect(() => {
    // Clears the previous source's failure state when the image URL changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailed(false);
  }, [src]);

  useEffect(() => {
    checkLoaded();
  }, [src, checkLoaded]);

  // A blank src would otherwise resolve against the page URL and render the
  // document as a broken image.
  if (failed || !src.trim()) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-agro-50 to-emerald-100 text-3xl',
          className
        )}
      >
        <span aria-hidden="true">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      onLoad={checkLoaded}
      className={className}
    />
  );
};
