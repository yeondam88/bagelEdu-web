import { useState, useEffect } from 'react';
import { getImageSrcString } from '../utils/images';

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

  // For all images, we use the utility function to get the appropriate string src
  const imageSrc = getImageSrcString(src);

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  );
} 