"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

// Populate with actual photos in /public/images/gallery/
// Categories: ICPC, hackathons, team events, award ceremonies, conferences
const galleryItems: GalleryItem[] = [];

export function Gallery() {
  return (
    <section id="gallery" className="section px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <span className="section-label">Moments</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Gallery
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Contests, hackathons, and engineering life — beyond the code
          </p>
        </div>

        {galleryItems.length > 0 ? (
          // Masonry grid using CSS columns (no extra deps)
          <div className="columns-1 sm:columns-2 md:columns-3 gap-3 space-y-3">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className="bento-card overflow-hidden break-inside-avoid hover:border-zinc-600 transition-colors group"
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-zinc-400 text-xs leading-snug">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Placeholder until photos are added
          <div className="bento-card p-16 flex flex-col items-center justify-center text-center">
            <Camera className="w-10 h-10 text-zinc-700 mb-4" />
            <p className="text-zinc-400 text-sm font-medium">Gallery coming soon</p>
            <p className="text-zinc-600 text-xs mt-1">
              Photos from contests, hackathons, and events
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
