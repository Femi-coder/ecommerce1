import Stripe from "stripe";
import clientPromise from "../../lib/mongodb";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      const client = await clientPromise;
      const db = client.db("ecommerce");
      await db.collection("orders").updateOne(
        { sessionId: session.id },
        {
          $set: {
            sessionId: session.id,
            status: session.payment_status || "paid",
            total: (session.amount_total || 0) / 100,
            currency: session.currency || "eur",
            email: session.customer_details?.email || null,
            shipping: session.shipping_details || null,
            items: lineItems.data.map(li => ({
              description: li.description,
              quantity: li.quantity,
              amount: (li.amount_total || 0) / 100,
              currency: li.currency,
            })),
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );

      console.log("✅ Order upserted:", session.id);
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook handler error:", e);
    return res.status(500).send("Webhook handler failed");
  }
}