import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartSection from '@/lib/ui/components/AddToCartSection';
import { type Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

// ✅ Check if running on Vercel (build) to skip DB query
const isBuildTime = process.env.VERCEL === '1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (isBuildTime) {
    return {
      title: 'Shopizon Product',
      description: 'Static product placeholder during build',
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product does not exist.',
    };
  }

  return {
    title: product.name,
    description: product.description || 'Find amazing products on Shopizon.',
    openGraph: {
      images: [
        {
          url: product.images[0]?.url || '/placeholder.png',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  if (isBuildTime) {
    // ✅ Show static placeholder page during Vercel build
    return (
      <div className="container mx-auto px-4 py-12 max-w-screen-lg">
        <h1 className="text-3xl font-bold">Product Placeholder</h1>
        <p>Data not available during build (Prisma disabled).</p>
      </div>
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!product) return notFound();

  const imageUrl = product.images[0]?.url || '/placeholder.png';

  return (
    <div className="container mx-auto px-4 py-12 max-w-screen-lg">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <Image
            src={imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg object-cover w-full max-h-[500px]"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-800">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700">
            {product.description || 'No description provided.'}
          </p>
          <AddToCartSection productId={product.id} />
        </div>
      </div>
    </div>
  );
}
