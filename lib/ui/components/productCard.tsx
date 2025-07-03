import Link from "next/link";
import Image from "next/image"; // ✅ Import Next.js Image component

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  id: string;
}

export default function ProductCard({ name, image, price, id }: ProductCardProps) {
  return (
    <div>
      <Link href={`/products/${id}`}>
        <div>
          <Image
            src={image}
            alt={name}
            width={300}         
            height={300}
            className="object-cover rounded-md"
          />
          <h4>{name}</h4>
          <p>{`$${price.toFixed(2)}`}</p>
        </div>
      </Link>
    </div>
  );
}
