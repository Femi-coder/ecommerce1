import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");

    // filter by category if provided
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await db.collection("products").find(filter).toArray();
    res.status(200).json(products);
  } catch (err) {
    console.error("API /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
