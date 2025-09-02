import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadCart, saveCart } from "../lib/storage";

const CartContext = createContext(null);

/** compare by (id + size) */
const sameVariant = (a, id, size) =>
  a.id === id && (a.size ?? null) === (size ?? null);

/** normalize legacy items (no size / wrong types) */
function normalize(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter(Boolean)
    .map(i => ({
      id: i.id,
      name: i.name,
      price: Number(i.price) || 0,
      image: i.image ?? "",
      size: i.size ?? null,
      qty: Math.max(1, Number(i.qty) || 1),
    }));
}

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return normalize(action.payload);
    }

    case "ADD": {
      const { id, name, price, image, size = null } = action.payload;
      const idx = state.findIndex(i => sameVariant(i, id, size));
      if (idx >= 0) {
        const next = [...state];
        next[idx] = {
          ...next[idx],
          qty: next[idx].qty + 1,
          image: next[idx].image || image || "",
          name: next[idx].name || name,
          price: Number(price) || next[idx].price,
        };
        return next;
      }
      return [
        ...state,
        { id, name, price: Number(price) || 0, image: image ?? "", size, qty: 1 },
      ];
    }

    case "INC": {
      const { id, size = null } = action;
      return state.map(i =>
        sameVariant(i, id, size) ? { ...i, qty: i.qty + 1 } : i
      );
    }

    case "DEC": {
      const { id, size = null } = action;
      return state
        .map(i =>
          sameVariant(i, id, size) ? { ...i, qty: Math.max(0, i.qty - 1) } : i
        )
        .filter(i => i.qty > 0);
    }

    case "SET_QTY": {
      const { id, size = null, qty } = action;
      const q = Math.max(1, Number(qty) || 1);
      return state.map(i =>
        sameVariant(i, id, size) ? { ...i, qty: q } : i
      );
    }

    case "REMOVE": {
      const { id, size = null } = action;
      return state.filter(i => !sameVariant(i, id, size));
    }

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
    const subtotal = state.reduce((s, i) => s + i.qty * (Number(i.price) || 0), 0);
    return { count, subtotal };
  }, [state]);

  const api = useMemo(
    () => ({
      items: state,
      totals,
      // item = { id, name, price, image, size? }
      add: (item) => dispatch({ type: "ADD", payload: item }),
      // ops accept (id, size) to target the variant
      inc: (id, size = null) => dispatch({ type: "INC", id, size }),
      dec: (id, size = null) => dispatch({ type: "DEC", id, size }),
      setQty: (id, size = null, qty) => dispatch({ type: "SET_QTY", id, size, qty }),
      remove: (id, size = null) => dispatch({ type: "REMOVE", id, size }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state, totals]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}