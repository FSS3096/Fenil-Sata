import { ImageSet } from "../data/portfolio";

type OptimizedPictureProps = {
  image: ImageSet;
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
  return (
    <picture>
      <source srcSet={image.avif} type="image/avif" />
      <source srcSet={image.webp} type="image/webp" />
      <img className={className} src={image.fallback} alt={alt} loading={loading} />
    </picture>
  );
}
