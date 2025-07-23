import { getProducts } from "@/lib/actions/db_product_actions";
import styles from "./LatestProductsSection.module.css";
import ProductCard from "@/lib/ui/components/productCard";

const isBuildTime = process.env.VERCEL === "1";

export default async function LatestProductsSection() {
  let products: any[] = [];

  if (!isBuildTime) {
    products = await getProducts();
  }

  return (
    <section className={styles.latestProducts}>
      <h3 className={styles.heading}>Latest Products</h3>

      {isBuildTime ? (
        <p style={{ color: "#777", padding: "10px" }}>
          Products will load dynamically at runtime.
        </p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.images?.[0]?.url || "/placeholder.jpg"}
              price={`${product.price}`}
              id={product.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
