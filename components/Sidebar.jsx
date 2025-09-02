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
        className={`nav-link ${active ? "active" : ""}`}
      >
        {label}
      </Link>
    </li>
  );
};

export default function Sidebar() {
  const { totals } = useCart();
  const [open, setOpen] = useState(false);

  // Prevent body scroll when drawer is open (mobile)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="topbar">
        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
        <h1 className="logo">Femi Shop</h1>
      </div>

      {/* Backdrop (click to close) */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      {/* Sidebar (desktop static; mobile off-canvas) */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        {/* Close button - mobile only */}
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="only-mobile burger"
        >
          ✕
        </button>

        {/* Title - visible on desktop only */}
        <h1 className="sidebar-title">Femi Shop</h1>

        <ul className="nav">
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
