// DO NOT include "use client" at the top
import styles from "./LatestProductsSection.module.css";
import ProductCard from "@/lib/ui/components/productCard";
import { prisma } from "@/lib/db/prisma";

export default async function LatestProductsSection() {
  const products = await prisma.product.findMany();

  return (
    <section className={styles.latestProducts}>
      <h3 className={styles.heading}>Latest Products</h3>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.imageUrl}
            price={`$${product.price}`}
            id={product.id}
          />
        ))}
      </div>
    </section>
  );
}
