import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";

export default function CategoryGrid({ category, title, aspect = "3 / 4", fit = "cover" }) {
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

  // Group items by subcategory
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
          <h3 className="subcategory-title">{sub}</h3>
          <div
            className="grid"
            >
            {grouped[sub].map((p) => (
              <article key={p._id} className="card product-card">
                {/* Image */}
                <div className="imgbox" style={{ ["--aspect"]: aspect, ["--fit"]: fit }}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="280px"
                      className="img"
                    />
                  ) : (
                    <div className="imgbox__fallback">No image</div>
                  )}
                </div>

                {/* Title + price */}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 0" }}>
                  <h4>{p.name}</h4>
                  <span>{money(p.price)}</span>
                </div>

                {/* Button always at bottom */}
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    cart.add({
                      id: p._id || p.id,
                      name: p.name,
                      price: p.price,
                      image: p.image ?? ""
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
