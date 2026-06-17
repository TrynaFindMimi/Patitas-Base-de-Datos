import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const maxStock = 9999;

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const prodId = String(action.product.id);
      const stock = action.product.stock ?? maxStock;
      const existing = state.items.find(i => i.id === prodId);
      if (existing) {
        if (existing.quantity >= stock) return state;
        return {
          ...state,
          items: state.items.map(i =>
            i.id === prodId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, id: prodId, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== String(action.id)) };
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(i => i.id === String(action.id));
      const stock = item?.stock ?? maxStock;
      return {
        ...state,
        items: state.items.map(i =>
          i.id === String(action.id) ? { ...i, quantity: Math.min(Math.max(1, action.quantity), stock) } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const saved = localStorage.getItem('patitas-cart');
      return saved ? { items: JSON.parse(saved) } : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('patitas-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', product: { ...product, id: String(product.id) } });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id: String(id) });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id: String(id), quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
