import Image, { type ImageProps } from 'next/image';
import dimensions from './media-dimensions.json';

type Props = Omit<ImageProps, 'src' | 'width' | 'height'> & { src: string };
const media: Record<string, { width: number; height: number }> = dimensions;

/** Keep intrinsic proportions while serving smaller, lazy-loaded gallery images. */
export default function WatchaImage({ src, alt, sizes = '(max-width: 640px) 100vw, 640px', ...props }: Props) {
  const size = media[src] ?? { width: 1600, height: 1000 };
  return <Image {...props} alt={alt} src={src} width={size.width} height={size.height}
    sizes={sizes} data-original-src={src} />;
}
