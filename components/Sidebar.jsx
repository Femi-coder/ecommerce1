import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";

const LinkItem = ({ href, label }) => {
  const { asPath } = useRouter();
  const active = asPath === href;
  return (
    <li>
      <Link
        href={href}
        style={{
          display: "block",
          padding: "10px 12px",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: 500,
          background: active ? "#f0f4ff" : "transparent",
          color: active ? "#1a4fff" : "#222",
        }}
      >
        {label}
      </Link>
    </li>
  );
};

export default function Sidebar() {
  const { totals } = useCart();

  return (
    <div>
      <h1 style={{ fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}>
        Femi Shop
      </h1>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 6 }}>
        <LinkItem href="/" label="Home" />

        {/* Categories instead of generic Products */}
        <LinkItem href="/tops" label="Tops" />
        <LinkItem href="/hoodies" label="Hoodies & Sweatshirts" />
        <LinkItem href="/bottoms" label="Bottoms" />
        <LinkItem href="/footwear" label="Footwear" />
        <LinkItem href="/accessories" label="Accessories" />


        {/* Cart */}
        <LinkItem href="/cart" label={`Cart (${totals.count})`} />
      </ul>
    </div>
  );
}