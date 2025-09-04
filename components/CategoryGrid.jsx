import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";

function normalizeSizes(sizeField) {
  if (Array.isArray(sizeField)) return sizeField.map(String);
  if (typeof sizeField === "string") {
    const m = sizeField.replace(/\s/g, "").match(/^(-?\d+)\-(\-?\d+)$/);
    if (m) {
      const start = parseInt(m[1], 10);
      const end = parseInt(m[2], 10);
      const step = start <= end ? 1 : -1;
      const out = [];
      for (let v = start; step > 0 ? v <= end : v >= end; v += step) out.push(String(v));
      return out;
    }
  }
  return null; // no sizes / not parseable
}

function ProductCard({ p, aspect, fit }) {
  const cart = useCart();
  const sizes = useMemo(() => normalizeSizes(p.size), [p.size]);
  const [selected, setSelected] = useState(null);

  const canAdd = !sizes || !!selected; // if sizes exist, require a selection

  return (
    <article className="card product-card">
      {/* Image */}
      <div className="imgbox" style={{ ["--aspect"]: aspect, ["--fit"]: fit }}>
        {p.image ? (
          <Image src={p.image} alt={p.name} fill sizes="280px" className="img" />
        ) : (
          <div className="imgbox__fallback">No image</div>
        )}
      </div>

      {/* Title + price */}
      <div style={{ margin: "12px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <h4 className="card__title">{p.name}</h4>
          <span className="price">{money(p.price)}</span>
        </div>

        {/* Size selector (only if sizes exist) */}
        {sizes && (
          <div className="size-list">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`size-btn ${selected === s ? "selected" : ""}`}
                onClick={() => setSelected(s)}
                aria-pressed={selected === s}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add to cart */}
      <button
        className="btn btn-primary"
        disabled={!canAdd}
        onClick={() =>
          cart.add({
            id: p._id || p.id,
            name: p.name,
            price: p.price,
            image: p.image ?? "",
            size: selected, // may be null if no sizes
          })
        }
      >
        Add to cart
      </button>
    </article>
  );
}

export default function CategoryGrid({ category, title, aspect = "3 / 4", fit = "cover" }) {
  const [items, setItems] = useState([]);

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
    (acc[sub] ||= []).push(item);
    return acc;
  }, {});

  return (
    <section>
      <h2>{title}</h2>

      {Object.keys(grouped).map((sub) => (
        <div key={sub} style={{ marginBottom: 32 }}>
          <h3 className="subcategory-title">{sub}</h3>
          <div className="grid">
            {grouped[sub].map((p) => (
              <ProductCard key={p._id || p.id} p={p} aspect={aspect} fit={fit} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
