import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "../context/CartContext";

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
  const router = useRouter();

  // close drawer on route change
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // prevent background scroll when drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="topbar" style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", background: "var(--panel)",
        borderBottom: "1px solid var(--border)"
      }}>
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="app-sidebar"
          onClick={() => setOpen(true)}
          style={{ fontSize: 22, background: "none", border: 0, cursor: "pointer" }}
        >
          ☰
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Femi Shop</h1>
      </div>

      {/* Backdrop (mobile) */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      {/* Sidebar (desktop static; mobile off-canvas) */}
      <div id="app-sidebar" className={`sidebar ${open ? "open" : ""}`}>
        <h1 style={{ fontSize: 22, margin: "0 0 16px", fontWeight: 700 }}>Femi Shop</h1>
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
