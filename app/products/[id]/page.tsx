// app/products/[id]/page.tsx
import ProductPageContent from "./ProductPageContent";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductPageContent id={params.id} />;
}
