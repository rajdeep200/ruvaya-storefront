import Image from "next/image";

// Natural pixel size of /assets/logo.png (1536×1024, a 3:2 oval mark) — forcing
// it into an equal width/height box stretches it non-uniformly and squishes the
// oval inward from both sides, so `size` is treated as the height and the width
// is derived from this ratio instead of being set equal to it.
const LOGO_ASPECT_RATIO = 1536 / 1024;

type RuvayaLogoProps = {
  size?: number;
  className?: string;
};

export function RuvayaLogo({ size = 88, className }: RuvayaLogoProps) {
  const width = Math.round(size * LOGO_ASPECT_RATIO);
  return (
    <Image
      src="/assets/logo.png"
      alt="Ruvaya"
      width={width}
      height={size}
      className={className}
      style={{ width, height: size }}
    />
  );
}
