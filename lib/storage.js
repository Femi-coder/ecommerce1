export function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("cart", JSON.stringify(cart));
  } catch {
  }
}
