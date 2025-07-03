import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "mongodb";
import BuyNowButton from "./BuyNowButton";
import Image from "next/image";

export default async function ProductPage(
  props: { params: { id: string } }
) {
  const { id } = props.params;
  let objectId: ObjectId;

  try {
    objectId = new ObjectId(id);
  } catch {
    console.error("Invalid ObjectId format:", id);
    return notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: objectId.toString() },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      businessId: true,
      images: {
        select: { url: true },
        take: 1,
      },
    },
  });

  if (!product) return notFound();

  const imageUrl = product.images?.[0]?.url || "/placeholder.png";

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <Image
        src={imageUrl}
        alt={product.name}
        width={256}
        height={256}
        className="w-64 mb-4 object-cover"
      />
      <p className="font-semibold">Price: ${product.price.toFixed(2)}</p>
      <p className="mb-4">{product.description}</p>
      <BuyNowButton productId={product.id} businessId={product.businessId} />
    </main>
  );
}
