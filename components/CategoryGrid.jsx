import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";

/** Normalize any size shape to an array of labels (["S","M","L"] or ["6","7",...]) */
function normalizeSizes(product) {
  // 1) Apparel: sizes (array)
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    return product.sizes.map(String);
  }

  // 2) Shoes: size (array or string)
  const sizeField = product.size;
  if (Array.isArray(sizeField) && sizeField.length > 0) {
    return sizeField.map(String);
  }
  if (typeof sizeField === "string" && sizeField.trim()) {
    // try JSON array string first
    try {
      const parsed = JSON.parse(sizeField);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch { }
    // then try range "6-13"
    const m = sizeField.replace(/\s/g, "").match(/^(-?\d+)-(-?\d+)$/);
    if (m) {
      const start = parseInt(m[1], 10);
      const end = parseInt(m[2], 10);
      const step = start <= end ? 1 : -1;
      const out = [];
      for (let v = start; step > 0 ? v <= end : v >= end; v += step) out.push(String(v));
      return out;
    }
  }

  // 3) Variants array with size
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const labels = product.variants
      .map(v => v?.size)
      .filter(Boolean)
      .map(String);
    if (labels.length) return labels;
  }

  return null;
}

/** Single product tile (isolated component so hooks stay stable) */
function ProductCard({ p, aspect = "3 / 4", fit = "cover" }) {
  const cart = useCart();
  const sizes = useMemo(() => normalizeSizes(p), [p]);
  const [selected, setSelected] = useState(null);

  const selectedPrice = useMemo(() => {
    if (!Array.isArray(p.variants) || !selected) return p.price;
    const m = p.variants.find(v => String(v.size) === String(selected));
    return m?.price ?? p.price;
  }, [p.variants, p.price, selected]);

  const canAdd = !sizes || !!selected;

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

      {/* CONTENT WRAPPER */}
      <div className="card__content">
        {/* Title + price */}
        <div className="card__row">
          <div className="card__title">{p.name}</div>
          <div className="price">{money(selectedPrice)}</div>
        </div>

        {/* Sizes */}
        {sizes && (
          <div className="size-list">
            {sizes.map(s => (
              <button
                key={s}
                type="button"
                className={`size-btn ${selected === s ? "selected" : ""}`}
                onClick={() => setSelected(s)}
                aria-pressed={selected === s}
                aria-label={`Select size ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* CTA pinned to bottom */}
        <div className="actions mt-3">
          <button
            className="btn btn-primary"
            disabled={!canAdd}
            onClick={() =>
              cart.add({
                id: p._id || p.id,
                name: p.name,
                price: selectedPrice,
                image: p.image ?? "",
                size: sizes ? selected : null,
              })
            }
            title={canAdd ? "Add to cart" : "Select a size first"}
          >
            {sizes && selected ? `Add size ${selected}` : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CategoryGrid({ category, title, aspect = "3 / 4", fit = "cover" }) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("idle"); // idle | loading | done | error

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setState("loading");
        const url = category ? `/api/products?category=${encodeURIComponent(category)}` : "/api/products";
        const res = await fetch(url);
        const data = await res.json();
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
        setState("done");
      } catch (e) {
        if (!alive) return;
        setState("error");
      }
    })();
    return () => { alive = false; };
  }, [category]);

  // Group by subcategory for headings
  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      const sub = item.subcategory || "Other";
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <section>
      {title && <h2>{title}</h2>}

      {state === "loading" && (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <article key={i} className="card card--skeleton product-card">
              <div className="imgbox" style={{ ["--aspect"]: aspect }} />
              <div className="sk-line" />
              <div className="sk-line sk-line--short" />
              <div className="sk-btn" />
            </article>
          ))}
        </div>
      )}

      {state === "error" && <p className="muted">Couldn’t load products. Please try again.</p>}

      {state === "done" && items.length === 0 && (
        <p className="muted">No products found.</p>
      )}

      {state === "done" && items.length > 0 && (
        <>
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
        </>
      )}
    </section>
  );
}
