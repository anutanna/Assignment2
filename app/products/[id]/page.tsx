// app/products/[id]/page.tsx

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import ProductPageContent from "./ProductPageContent";

export default async function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageContent id={params.id} />;
}

