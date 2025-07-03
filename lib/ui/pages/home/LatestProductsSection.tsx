import styles from "./LatestProductsSection.module.css";
import ProductCard from "@/lib/ui/components/productCard";
import { prisma } from "@/lib/prisma";

export default async function LatestProductsSection() {
  const products = await prisma.product.findMany({
    include: {
      images: {
        select: { url: true },
        take: 1,
      },
    },
  });

  return (
    <section className={styles.latestProducts}>
      <h3 className={styles.heading}>Latest Products</h3>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.images?.[0]?.url ?? "/placeholder.png"}
            price={product.price} 
            id={product.id}
          />

        ))}
      </div>
    </section>
  );
}
