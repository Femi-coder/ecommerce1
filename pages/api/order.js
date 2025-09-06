// pages/api/order.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const id = req.query.id; // Stripe session_id
    if (!id) return res.status(400).json({ error: "Missing id" });

    const client = await clientPromise;
    const db = client.db("ecommerce");
    const order = await db.collection("orders").findOne({ sessionId: id });

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (e) {
    console.error("Order fetch error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
}
