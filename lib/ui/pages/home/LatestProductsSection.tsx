import { getProducts } from "@/lib/actions/db_product_actions";
import styles from "./LatestProductsSection.module.css";
import ProductCard from "@/lib/ui/components/productCard";

export const dynamic = "force-dynamic"; // ✅ Disable static optimization
export const revalidate = 0; // ✅ Disable ISR (optional)

export default async function LatestProductsSection() {
  const products = await getProducts();

  return (
    <section className={styles.latestProducts}>
      <h3 className={styles.heading}>Latest Products</h3>
      <div className={styles.grid}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.images?.[0]?.url || "/placeholder.jpg"}
              price={`${product.price}`}
              id={product.id}
            />
          ))
        ) : (
          <p style={{ color: "#777", padding: "10px" }}>
            No products available.
          </p>
        )}
      </div>
    </section>
  );
}
