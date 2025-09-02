import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <aside>
        <Sidebar />
      </aside>
      <main id="main">{children}</main>
    </div>
  );
}