import { Suspense } from "react";
import AllProductsPage from "../../lib/ui/components/AllProductsPage";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

      <Suspense fallback={<p className="text-center">Loading products...</p>}>
        <AllProductsPage />
      </Suspense>
    </main>
  );
}
