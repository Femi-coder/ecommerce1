import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <button className="burger" onClick={() => setOpen(!open)}>
        ☰
      </button>
      <h1 className="logo">Femi Shop</h1>

      <nav className={`sidebar ${open ? "open" : ""}`}>
        <a href="/">Home</a>
        <a href="/tops">Tops</a>
        <a href="/hoodies">Hoodies & Sweatshirts</a>
        <a href="/bottoms">Bottoms</a>
        <a href="/footwear">Footwear</a>
        <a href="/accessories">Accessories</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
  );
}