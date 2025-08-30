import { useCart } from "../context/CartContext";
import { money } from "../lib/format";

export default function Cart() {
  const cart = useCart();
  const { items, totals } = cart;

  return (
    <section>
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <>
          <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8 }}>Product</th>
                  <th style={{ textAlign: "right", padding: 8 }}>Price</th>
                  <th style={{ textAlign: "center", padding: 8 }}>Qty</th>
                  <th style={{ textAlign: "right", padding: 8 }}>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 12 }}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                        />
                      )}
                      <span>{item.name}</span>
                    </td>
                    <td style={{ padding: 8, textAlign: "right" }}>{money(item.price)}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                        <button onClick={() => cart.dec(item.id)}>-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e =>
                            cart.setQty(item.id, parseInt(e.target.value || "1", 10))
                          }
                          style={{
                            width: 56,
                            textAlign: "center",
                            padding: 8,
                            borderRadius: 10,
                            border: "1px solid #ddd",
                          }}
                        />
                        <button onClick={() => cart.inc(item.id)}>+</button>
                      </div>
                    </td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      {money(item.qty * item.price)}
                    </td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      <button onClick={() => cart.remove(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button onClick={cart.clear}>Clear cart</button>
            <div className="card" style={{ minWidth: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Items</span><strong>{totals.count}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span>Subtotal</span><strong>{money(totals.subtotal)}</strong>
              </div>
              <button style={{ marginTop: 12, width: "100%" }}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
