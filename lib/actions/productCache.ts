
import { prisma } from "@/lib/db/prisma";

import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

export async function getCachedProducts() {
  const cacheKey = "latest_products";

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log("✅ From cache");
    return cached;
  }

  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  cache.set(cacheKey, products);
  console.log("🔄 From DB");
  return products;
}
