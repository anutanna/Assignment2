import Link from "next/link";

export default function ProductCard({ name, image, price, id }) {
  return (
    <div>
      <Link href={`/products/${id}`}>
        <div>
          <img src={image} alt={name} />
          <h4>{name}</h4>
          <p>{price}</p>
        </div>
      </Link>
    </div>
  );
}
