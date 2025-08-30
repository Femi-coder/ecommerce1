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

    return (
        <section>
            <h2>{title}</h2>
            <div
                className="grid gap-6"
                style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 280px))",
                }}
            >
                {items.map((p) => (
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

                        <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 0" }}>
                            <h3>{p.name}</h3>
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
        </section>
    );
}