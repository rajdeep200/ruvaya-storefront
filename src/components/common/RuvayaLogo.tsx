import Image from "next/image";

type RuvayaLogoProps = {
  size?: number;
  className?: string;
};

export function RuvayaLogo({ size = 88, className }: RuvayaLogoProps) {
  return (
    <Image
      src="/assets/logo.png"
      alt="Ruvaya"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
