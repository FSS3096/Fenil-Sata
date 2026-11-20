import { ImageSet } from "../data/portfolio";

type OptimizedPictureProps = {
  image: ImageSet | string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  /** Intrinsic size of the file, so the browser knows the aspect ratio before it arrives. */
  width?: number;
  height?: number;
  /** "low" lets a below-the-fold image download early without competing with the hero. */
  priority?: "high" | "low" | "auto";
};

export function OptimizedPicture({
  image,
  alt,
  className = "",
  loading = "lazy",
  width,
  height,
  priority
}: OptimizedPictureProps) {
  // lowercase attribute: React 18 does not know `fetchPriority` yet
  const extra = { width, height, ...(priority ? { fetchpriority: priority } : {}) };

  if (typeof image === "string") {
    return <img className={className} src={image} alt={alt} loading={loading} decoding="async" {...extra} />;
  }

  const { avif, webp, fallback } = image;
  const hasSources = Boolean(avif || (webp && webp !== fallback));

  if (!hasSources) {
    return <img className={className} src={fallback} alt={alt} loading={loading} decoding="async" {...extra} />;
  }

  return (
    <picture>
      {avif ? <source srcSet={avif} type="image/avif" /> : null}
      {webp ? <source srcSet={webp} type="image/webp" /> : null}
      <img className={className} src={fallback} alt={alt} loading={loading} decoding="async" {...extra} />
    </picture>
  );
}
