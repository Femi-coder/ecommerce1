import Stripe from "stripe";

//Initialize Stripe with my secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Make sure we actually have a secret key set
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY env var" });
  }

  try {
    const { cartItems, currency = "eur" } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "No items to checkout" });
    }

    // Convert each cart item into a Stripe line item
    const line_items = cartItems.map((i, idx) => {
      const unit = Number(i.price);
      const qty = Number(i.qty) || 1;
      if (!Number.isFinite(unit) || unit <= 0) throw new Error(`Invalid price at index ${idx}: ${i.price}`);
      if (!Number.isInteger(qty) || qty <= 0) throw new Error(`Invalid qty at index ${idx}: ${i.qty}`);

      return {
        price_data: {
          currency,
          product_data: {
            name: String(i.name || "Item"), // Product name
            images: i.image ? [String(i.image)] : []
          },
          unit_amount: Math.round(unit * 100),
        },
        quantity: qty,   // Quantity
        adjustable_quantity: { enabled: true, minimum: 1, maximum: 99 }, //Lets the customer adjust qty on the stripe checkout page
      };
    });

    // Stripe creates a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["IE", "GB", "US", "DE", "FR", "ES", "IT", "NL"] },
    });

    // Sends back to the frontend
    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: err.message || "Stripe session error" });
  }
}