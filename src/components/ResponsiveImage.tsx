import { useState, useEffect } from 'react';
import { Image } from 'astro:assets';

interface ResponsiveImageProps {
  src: any;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  width = 600,
  height = 400,
  className = '',
}: ResponsiveImageProps) {
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    // Check if the src is a string URL
    if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
      setIsRemote(true);
    }
  }, [src]);

  if (isRemote) {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className}
      />
    );
  }

  // For local images, we need to render Astro's Image component
  // But we can't use Astro components directly in React
  // So we'll need a workaround
  return (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  );
} 