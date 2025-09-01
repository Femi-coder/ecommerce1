import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { money } from "../lib/format";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  { href: "/tops", title: "Tops", color: "var(--primary)" },
  { href: "/hoodies", title: "Hoodies & Sweatshirts", color: "#0ea5e9" },
  { href: "/bottoms", title: "Bottoms", color: "#22c55e" },
  { href: "/footwear", title: "Footwear", color: "#f97316" },
  { href: "/accessories", title: "Accessories", color: "#a855f7" },
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const cart = useCart();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState("loading");
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!alive) return;
        setItems(Array.isArray(data) ? data.slice(0, 5) : []); // show up to 5
        setState("done");
      } catch {
        if (!alive) return;
        setState("error");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <>
      <Head>
        <title>Welcome | Store</title>
        <meta name="description" content="Next.js starter shop with clean, extendable layout." />
      </Head>

      <main>
        {/* Hero */}
        <section className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Welcome to the Store</h1>
          <p className="muted" style={{ marginBottom: 16 }}>
            This is the home page. Use the sidebar to navigate — or jump straight into categories below.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/tops" className="btn btn-primary">Shop Tops</Link>
            <Link href="/footwear" className="btn">Shop Footwear</Link>
          </div>
        </section>

        {/* Category quick links */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 12 }}>Browse Categories</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href} className="card" style={{ padding: 18 }}>
                <h3 style={{ margin: 0, color: c.color }}>{c.title}</h3>
                <p className="muted" style={{ marginTop: 6 }}>Shop {c.title.toLowerCase()} →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section>
          <h2 style={{ marginBottom: 12 }}>Featured</h2>

          {state === "loading" && (
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 280px))" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <article key={i} className="card" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="imgbox" style={{ height: 200 }} />
                  <div className="sk-line" />
                  <div className="sk-line sk-line--short" />
                  <div className="sk-btn" />
                </article>
              ))}
            </div>
          )}

          {state === "error" && <p className="muted">Couldn’t load products. Please try again.</p>}

          {state === "done" && items.length === 0 && (
            <p className="muted">No products yet. Add some in your database to see them here.</p>
          )}

          {state === "done" && items.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 280px))" }}>
              {items.map((p) => (
                <article
                  key={p._id || p.id}
                  className="card"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {/* Image */}
                  <div
                    className="imgbox"
                    style={{
                      position: "relative",
                      height: 200,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#f4f4f4",
                    }}
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width:768px) 45vw, 280px"
                        style={{ objectFit: "cover", backgroundColor: "#fff" }}
                      />
                    ) : (
                      <div className="imgbox__fallback">No image</div>
                    )}
                  </div>

                  {/* Name + price */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, marginTop: 12, minHeight: 56 }}>
                    <h3 className="card__title" style={{ margin: 0, lineHeight: 1.2 }}>{p.name}</h3>
                    <span className="price">{money(p.price)}</span>
                  </div>

                  {/* Actions pinned to bottom */}
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        cart.add({ id: p._id || p.id, name: p.name, price: p.price, image: p.image ?? "" })
                      }
                    >
                      Add to cart
                    </button>
                    <Link
                      href={p.category ? `/${encodeURIComponent(p.category.toLowerCase())}` : "#"}
                      className="btn"
                    >
                      View category
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}