export default function Home() {
  return (
    <section>
      <h2>Welcome to the Store</h2>
      <p>This is the home page. Use the sidebar to navigate.</p>
      <div className="cards">
        <div className="card"><h3>Fast</h3><p>Next.js starter ready.</p></div>
        <div className="card"><h3>Clean</h3><p>Portfolio-style spacing.</p></div>
        <div className="card"><h3>Extendable</h3><p>Add auth, DB, cart later.</p></div>
      </div>
    </section>
  );
}
