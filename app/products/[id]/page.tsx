import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";

export default async function ProductPage(props: { params: { id: string } }) {
  const { id } = props.params;  // safe way for Next.js App Router
  let objectId: ObjectId;

  try {
    objectId = new ObjectId(id);
  } catch (error) {
    console.error("Invalid ObjectId format:", id);
    return notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: objectId.toHexString() },
  });

  if (!product) return notFound();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        className="mt-4 w-96 rounded border shadow"
      />
      <p className="mt-4 text-lg font-semibold">Price: ${product.price}</p>
      <p className="mt-2 text-gray-700">{product.description}</p>
    </main>
  );
}
