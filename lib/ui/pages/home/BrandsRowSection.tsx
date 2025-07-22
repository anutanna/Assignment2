import styles from './BrandsRowSection.module.css';
import Image from 'next/image';

const brandLogos = ['elvis', 'comax', 'mba', 'hp', 'nocoffee'];

export default function BrandsRowSection() {
  return (
    <section className={styles.brandsRow}>
      {brandLogos.map((brand, index) => (
        <Image
  key={index}
  src={`/brands/${brand}.png`}
  alt={brand}
  width={80}
  height={40}
  className={styles.logo}
/>
      ))}
    </section>
  );
}
