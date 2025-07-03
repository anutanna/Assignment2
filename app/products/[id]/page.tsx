import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "mongodb";
import BuyNowButton from "./BuyNowButton";
import Image from "next/image";


export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
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
    },
  });
    if (!product) return notFound();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <Image
        src={product.imageUrl || "/placeholder.png"}
        alt={product.name}
        width={256} // or your preferred width in pixels
        height={256} // or appropriate height
        className="w-64 mb-4"
      />

      <p className="font-semibold">Price: ${product.price.toFixed(2)}</p>
      <p>{product.description}</p>
      <BuyNowButton productId={product.id} businessId={product.businessId} />


    </main>
  );
}
