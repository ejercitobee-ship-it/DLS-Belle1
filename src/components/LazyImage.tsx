import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  webpSrc?: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
}

export default function LazyImage({
  src,
  alt,
  webpSrc,
  className = '',
  placeholder = 'bg-charcoal-800 animate-pulse',
  onLoad
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check for browser support of WebP
    const canvas = document.createElement('canvas');
    const isWebPSupported = (canvas.toDataURL('image/webp') as string).indexOf('image/webp') === 5;

    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const finalSrc = isWebPSupported && webpSrc ? webpSrc : src;
            setImageSrc(finalSrc);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      { rootMargin: '50px' } // Start loading 50px before image enters viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      const current = imgRef.current;
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [src, webpSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className={`relative overflow-hidden ${!isLoaded ? placeholder : ''}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
      />
    </div>
  );
}
