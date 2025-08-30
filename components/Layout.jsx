import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #eee", padding: "20px" }}>
        <Sidebar />
      </aside>
      <main style={{ padding: "32px", maxWidth: 1200, width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
