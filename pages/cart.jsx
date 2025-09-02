import { useState } from "react";
import { useCart } from "../context/CartContext";
import { money } from "../lib/format";

export default function Cart() {
  const cart = useCart();
  const { items, totals } = cart;
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    if (!items.length || loading) return;
    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items }), // includes size if present
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error || "Failed to start checkout.");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <>
          {/* Keep everything centered and capped */}
          <div className="cart-shell">
            <div className="cart-wrap card">
              {/* DESKTOP TABLE */}
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: "right" }}>Price</th>
                    <th style={{ textAlign: "center" }}>Qty</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.id}|${item.size ?? ""}`}>
                      <td className="cart-product-cell">
                        {item.image && <img src={item.image} alt={item.name} />}
                        <div>
                          <div>{item.name}</div>
                          {item.size && (
                            <div className="muted" style={{ fontSize: ".9rem" }}>
                              Size: <strong>{item.size}</strong>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>{money(item.price)}</td>
                      <td style={{ textAlign: "center" }}>
                        <div className="qty-controls">
                          <button onClick={() => cart.dec(item.id, item.size)}>-</button>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              cart.setQty(
                                item.id,
                                item.size,
                                parseInt(e.target.value || "1", 10)
                              )
                            }
                          />
                          <button onClick={() => cart.inc(item.id, item.size)}>+</button>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {money(item.qty * item.price)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button onClick={() => cart.remove(item.id, item.size)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* MOBILE CARDS */}
              <div className="cart-list">
                {items.map((item) => (
                  <div key={`${item.id}|${item.size ?? ""}`} className="cart-card">
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div>
                      <div className="name">{item.name}</div>
                      {item.size && <div className="price">Size: {item.size}</div>}
                      <div className="total">Total: {money(item.qty * item.price)}</div>
                      <button
                        className="remove-btn"
                        onClick={() => cart.remove(item.id, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="qty">
                      <button onClick={() => cart.dec(item.id, item.size)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => cart.inc(item.id, item.size)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="cart-actions">
              <button onClick={cart.clear}>Clear cart</button>
              <div className="card cart-summary">
                <div>
                  <span>Items</span>
                  <strong>{totals.count}</strong>
                </div>
                <div>
                  <span>Subtotal</span>
                  <strong>{money(totals.subtotal)}</strong>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={checkout}
                  disabled={loading}
                >
                  {loading ? "Redirecting…" : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}