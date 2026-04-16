/**
 * SOLUTION 04 — useReducer: Shopping Cart
 */

import { useReducer } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.id !== action.payload.id) };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter(i => i.id !== id) };
      }
      return {
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

const INITIAL_STATE: CartState = { items: [] };

const PRODUCTS: Product[] = [
  { id: '1', name: 'React Book', price: 29.99 },
  { id: '2', name: 'TypeScript Course', price: 49.99 },
  { id: '3', name: 'VS Code License', price: 0 },
];

export default function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  // Derived values — computed from state
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <h2>Shop</h2>
      <ul>
        {PRODUCTS.map(product => (
          <li key={product.id}>
            {product.name} — ${product.price.toFixed(2)}
            <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>

      <h2>Cart ({itemCount} items)</h2>
      {cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.items.map(item => (
              <li key={item.id}>
                {item.name} (${item.price.toFixed(2)})
                <button
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      payload: { id: item.id, quantity: item.quantity - 1 },
                    })
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QUANTITY',
                      payload: { id: item.id, quantity: item.quantity + 1 },
                    })
                  }
                >
                  +
                </button>
                <button
                  onClick={() =>
                    dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Total: ${totalPrice.toFixed(2)}</p>
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
