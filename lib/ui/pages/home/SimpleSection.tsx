
"use client";

import dynamic from "next/dynamic";

const LatestProductsSection = dynamic(() => import("./LatestProductsSection"), {
  ssr: false,
  loading: () => <p>Loading products...</p>,
});

const PromoBannerSection = dynamic(() => import("./PromoBannerSection"), {
  ssr: false,
  loading: () => <p>Loading banner...</p>,
});

export default function SimpleSection() {
  return (
    <div>
      <PromoBannerSection />
      <LatestProductsSection />
    </div>
  );
}
