import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";


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

  // prevent body scroll when drawer is open (mobile)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="topbar">
        <button
          className="menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          style={{ fontSize: 22, background: "none", border: 0, cursor: "pointer" }}
        >
          {open ? "✕" : "☰"}
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Femi Shop</h1>
      </div>

      {/* Backdrop (click to close). It starts below the fixed topbar in CSS */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <div className={`sidebar ${open ? "open" : ""}`}>
        {/* Close button - mobile only */}
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="only-mobile"
          style={{ fontSize: 22, background: "none", border: 0, cursor: "pointer", marginBottom: 8 }}
        >
          ✕
        </button>

        <h1 style={{ fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}>Femi Shop</h1>
        <h1
          className="sidebar-title"
          style={{ fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}
        >
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