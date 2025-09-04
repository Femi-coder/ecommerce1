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

function CartIcon({ count, onClick, className = "" }) {
  return (
    <Link
      href="/cart"
      aria-label="Open cart"
      className={`cart-button ${className}`}
      onClick={onClick}
    >
      {/* simple inline SVG cart */}
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M3 3h2l2.4 12.1a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L21 8H7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.6" />
        <circle cx="18" cy="20" r="1.6" />
      </svg>
      {count > 0 && <span className="cart-badge" aria-label={`${count} items`}>{count}</span>}
    </Link>
  );
}

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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Femi Shop</h1>
          {/* cart icon on mobile header */}
          <CartIcon count={totals.count} onClick={() => setOpen(false)} />
        </div>
      </div>

      {/* Backdrop (click to close) */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      {/* Sidebar (desktop static; mobile drawer) */}
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

        {/* Desktop title + cart icon */}
        <div className="sidebar-title-row">
          <h1 className="sidebar-title" style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>
            Femi Shop
          </h1>
          <CartIcon count={totals.count} />
        </div>

        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 6, marginTop: 12 }}>
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
