import Stripe from "stripe";
import clientPromise from "../../lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY env var" });
  }

  try {
    const { cartItems, email, currency = "eur" } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "No items to checkout" });
    }

    // Create Stripe line items
    const line_items = cartItems.map((i, idx) => ({
      price_data: {
        currency,
        product_data: {
          name: String(i.name || "Item"),
          images: i.image ? [String(i.image)] : [],
        },
        unit_amount: Math.round(Number(i.price) * 100),
      },
      quantity: Number(i.qty) || 1,
    }));

    // Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/success?order_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      customer_email: email,
    });

    // Insert "pending" order in MongoDB
    const client = await clientPromise;
    const db = client.db("ecommerce");

    await db.collection("orders").insertOne({
      sessionId: session.id,
      email,
      items: cartItems,
      total: cartItems.reduce((sum, i) => sum + i.price * i.qty, 0),
      status: "pending",
      createdAt: new Date(),
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: err.message || "Stripe session error" });
  }
}
