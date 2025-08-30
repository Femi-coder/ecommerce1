import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadCart, saveCart } from "../lib/storage";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return Array.isArray(action.payload) ? action.payload : [];

    case "ADD": {
      const { id, name, price, image } = action.payload; // ← include image
      const existing = state.find(i => i.id === id);
      if (existing) {
        // bump qty; also fill in image if it was missing before
        return state.map(i =>
          i.id === id ? { ...i, qty: i.qty + 1, image: i.image || image } : i
        );
      }
      return [...state, { id, name, price, image, qty: 1 }]; // ← keep image
    }

    case "INC":
      return state.map(i => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i));

    case "DEC":
      return state
        .map(i => (i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
        .filter(i => i.qty > 0);

    case "SET_QTY":
      return state.map(i =>
        i.id === action.id ? { ...i, qty: Math.max(1, action.qty | 0) } : i
      );

    case "REMOVE":
      return state.filter(i => i.id !== action.id);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}


export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, []);
  // hydrate from localStorage once on client
  useEffect(() => {
    dispatch({ type: "INIT", payload: loadCart() });
  }, []);
  // persist on changes
  useEffect(() => {
    saveCart(state);
  }, [state]);

  const totals = useMemo(() => {
    const count = state.reduce((n, i) => n + i.qty, 0);
    const subtotal = state.reduce((s, i) => s + i.qty * i.price, 0);
    return { count, subtotal };
  }, [state]);

  const api = useMemo(() => ({
    items: state,
    totals,
    add: (item) => dispatch({ type: "ADD", payload: item }),
    inc: (id) => dispatch({ type: "INC", id }),
    dec: (id) => dispatch({ type: "DEC", id }),
    setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
    remove: (id) => dispatch({ type: "REMOVE", id }),
    clear: () => dispatch({ type: "CLEAR" }),
  }), [state, totals]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
