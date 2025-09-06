import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  const { order_id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order_id) return;
    (async () => {
      try {
        const res = await fetch(`/api/order?id=${encodeURIComponent(order_id)}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [order_id]);

  return (
    <section className="success" style={{ padding: "2rem" }}>
      <h2>Payment successful 🎉</h2>

      {loading && <p>Loading order details...</p>}
      {error && <p>⚠ {error}</p>}

      {!loading && order && (
        <article className="card order mt-3" style={{ padding: "1rem" }}>
          <h3>Order Summary</h3>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {order.total} {order.currency?.toUpperCase()}</p>
          <p><strong>Email:</strong> {order.email || "Not provided"}</p>
          <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          <h4>Items</h4>
          <ul>
            {order.items?.map((item, idx) => (
              <li key={idx}>
                {item.name} × {item.qty} — {item.price} {order.currency?.toUpperCase()}
              </li>
            ))}
          </ul>
        </article>
      )}

      {!loading && !order && !error && (
        <p>❌ Order not found. Please contact support.</p>
      )}
    </section>
  );
}
Success.getLayout = function PageLayout(page) {
  return page;
};
