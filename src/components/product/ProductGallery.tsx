"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics/track";
import type { ImageAsset, VideoAsset } from "@/types";

type ProductGalleryProps = {
  productId: string;
  images: ImageAsset[];
  video?: VideoAsset;
  productName: string;
};

export function ProductGallery({ productId, images, video, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const imageSlides = images.map((img) => ({ isVideo: false as const, image: img }));
  const slides = video ? [...imageSlides, { isVideo: true as const, video }] : imageSlides;

  function scrollToIndex(index: number) {
    setActiveIndex(index);
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
    track("product_image_interaction", { productId, metadata: { index } });
  }

  return (
    <div>
      <div className="flex gap-3">
        <div className="hidden flex-col gap-2 lg:flex">
          {images.map((img, i) => (
            <Button
              key={img.id}
              type="button"
              variant="ghost"
              onClick={() => scrollToIndex(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={activeIndex === i}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded border p-0 ${
                activeIndex === i ? "border-primary" : "border-border"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="56px" className="object-cover" />
            </Button>
          ))}
          {video && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => scrollToIndex(images.length)}
              aria-label="Play product video"
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded border bg-surface-muted p-0 ${
                activeIndex === images.length ? "border-primary" : "border-border"
              }`}
            >
              ▶
            </Button>
          )}
        </div>

        <div className="flex-1">
          <div
            ref={scrollRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              const index = Math.round(el.scrollLeft / el.clientWidth);
              if (index !== activeIndex) setActiveIndex(index);
            }}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] lg:overflow-hidden"
          >
            {slides.map((slide, i) => (
              <div key={i} className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-surface-muted">
                {slide.isVideo ? (
                  <video
                    controls
                    preload="none"
                    poster={slide.video.posterUrl}
                    onPlay={() => track("product_video_play", { productId })}
                    className="h-full w-full object-cover"
                  >
                    <source src={slide.video.url} />
                  </video>
                ) : (
                  <div
                    className="h-full w-full"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setZoomStyle({ transformOrigin: `${x}% ${y}%` });
                    }}
                    onMouseLeave={() => setZoomStyle(null)}
                  >
                    <Image
                      src={slide.image.url}
                      alt={slide.image.alt || `${productName}, image ${i + 1}`}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className={`object-cover transition-transform duration-300 ${
                        zoomStyle && activeIndex === i ? "scale-150 lg:cursor-zoom-in" : ""
                      }`}
                      style={activeIndex === i ? (zoomStyle ?? undefined) : undefined}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${activeIndex === i ? "bg-primary" : "bg-border"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
