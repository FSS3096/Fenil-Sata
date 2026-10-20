import { ImageSet } from "../data/portfolio";

type OptimizedPictureProps = {
  image: ImageSet | string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
};

export function OptimizedPicture({
  image,
  alt,
  className = "",
  loading = "lazy"
}: OptimizedPictureProps) {
  if (typeof image === "string") {
    return <img className={className} src={image} alt={alt} loading={loading} />;
  }

  const { avif, webp, fallback } = image;
  const hasSources = Boolean(avif || (webp && webp !== fallback));

  if (!hasSources) {
    return <img className={className} src={fallback} alt={alt} loading={loading} />;
  }

  return (
    <picture>
      {avif ? <source srcSet={avif} type="image/avif" /> : null}
      {webp ? <source srcSet={webp} type="image/webp" /> : null}
      <img className={className} src={fallback} alt={alt} loading={loading} />
    </picture>
  );
}
