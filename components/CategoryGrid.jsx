import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";

export default function CategoryGrid({ category, title }) {
  const [items, setItems] = useState([]);
  const cart = useCart();

  useEffect(() => {
    (async () => {
      const url = `/api/products?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    })();
  }, [category]);

  // 🔹 Group items by subcategory
  const grouped = items.reduce((acc, item) => {
    const sub = item.subcategory || "Other";
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(item);
    return acc;
  }, {});

  return (
    <section>
      <h2>{title}</h2>

      {Object.keys(grouped).map((sub) => (
        <div key={sub} style={{ marginBottom: "32px" }}>
          <h3 style={{ marginBottom: "16px" }}>{sub}</h3>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 280px))",
              gap: "16px",
            }}
          >
            {grouped[sub].map((p) => (
              <article key={p._id} className="card">
                <div
                  style={{
                    position: "relative",
                    height: 200,
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "#f4f4f4",
                  }}
                >
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 200vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "contain", backgroundColor: "#fff" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        placeItems: "center",
                        height: "100%",
                        color: "#888",
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "12px 0",
                  }}
                >
                  <h4>{p.name}</h4>
                  <span>{money(p.price)}</span>
                </div>

                <button
                  onClick={() =>
                    cart.add({
                      id: p._id,
                      name: p.name,
                      price: p.price,
                      image: p.image ?? "",
                    })
                  }
                >
                  Add to cart
                </button>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
