import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const LinkItem = ({ href, label, onClick }) => {
  const { asPath } = useRouter();
  const active = asPath === href;
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar with burger (mobile only) */}
      <div className="topbar">
        <button className="burger" onClick={() => setOpen(!open)}>☰</button>
        <h1 className="logo">Femi Shop</h1>
      </div>

      {/* Sidebar (collapsible on mobile) */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h1 style={{ fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}>
          Femi Shop
        </h1>

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 6 }}>
          <LinkItem href="/" label="Home" onClick={() => setOpen(false)} />
          <LinkItem href="/tops" label="Tops" onClick={() => setOpen(false)} />
          <LinkItem href="/hoodies" label="Hoodies & Sweatshirts" onClick={() => setOpen(false)} />
          <LinkItem href="/bottoms" label="Bottoms" onClick={() => setOpen(false)} />
          <LinkItem href="/footwear" label="Footwear" onClick={() => setOpen(false)} />
          <LinkItem href="/accessories" label="Accessories" onClick={() => setOpen(false)} />
          <LinkItem href="/cart" label={`Cart (${totals.count})`} onClick={() => setOpen(false)} />
        </ul>
      </div>
    </>
  );
}
