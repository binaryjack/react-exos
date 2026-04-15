/**
 * CHALLENGE 04 — useReducer: Shopping Cart
 *
 * Implement a shopping cart using useReducer with these actions:
 * - ADD_ITEM: add product to cart (if already exists, increase quantity)
 * - REMOVE_ITEM: remove product completely from cart
 * - UPDATE_QUANTITY: set a specific item's quantity (if 0, remove it)
 * - CLEAR_CART: empty the cart
 *
 * The state shape:
 * { items: CartItem[] }
 *
 * Display:
 * - List of cart items with quantity controls (+ / - buttons)
 * - Total price
 * - Item count badge
 * - Clear cart button
 *
 * Key concepts tested:
 * - Defining discriminated union action types
 * - Pure reducer function (no mutations, always return new state)
 * - useReducer over useState for complex state
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

// TODO 1: Define the Action union type with all 4 actions listed above
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  // TODO: add the remaining actions

// TODO 2: Implement the reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // TODO: If item exists → increase quantity; if not → add with quantity 1
      return state;
    }
    // TODO: handle REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
    default:
      return state;
  }
}

const INITIAL_STATE: CartState = { items: [] };

// Sample products to add to cart
const PRODUCTS: Product[] = [
  { id: '1', name: 'React Book', price: 29.99 },
  { id: '2', name: 'TypeScript Course', price: 49.99 },
  { id: '3', name: 'VS Code License', price: 0 },
];

export default function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  // TODO 3: Derive total price and item count from cart.items

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

      <h2>Cart {/* TODO 4: show item count badge */}</h2>
      {cart.items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.items.map(item => (
              <li key={item.id}>
                {item.name}
                <button
                  onClick={() =>
                    dispatch({ type: 'UPDATE_QUANTITY', /* TODO */ })
                  }
                >
                  -
                </button>
                {item.quantity}
                <button
                  onClick={() =>
                    dispatch({ type: 'UPDATE_QUANTITY', /* TODO */ })
                  }
                >
                  +
                </button>
                <button onClick={() => dispatch({ type: 'REMOVE_ITEM', /* TODO */ })}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {/* TODO 5: Show total price */}
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
