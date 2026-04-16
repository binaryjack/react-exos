// Challenge: Performance — React.memo + useCallback
//
// This component tree re-renders more than it needs to.
// The parent's counter state causes every child to re-render,
// even when their cost-relevant props haven't changed.
//
// TASKS:
// TODO 1: Wrap ProductCard with React.memo to prevent re-renders when props are stable
// TODO 2: Wrap FilterBar with React.memo
// TODO 3: Memoize the onAddToCart callback with useCallback
// TODO 4: Memoize the onFilterChange callback with useCallback
// TODO 5: Memoize filteredProducts with useMemo
// TODO 6: Open React DevTools Profiler — verify ProductCard only re-renders when products or filter changes
//
// EXPECTED BEHAVIOR: Clicking "Ping Counter" should NOT log any ProductCard renders

import { useState } from 'react';

// --- Simulated expensive render ---
function expensiveOperation(id: number): string {
  // Simulate layout computation
  let result = 0;
  for (let i = 0; i < 50_000; i++) result += i * id;
  return result.toString().slice(-4);
}

// --- ProductCard ---
// TODO 1: Wrap with React.memo
function ProductCard({
  product,
  onAddToCart,
}: {
  product: { id: number; name: string; price: number; category: string };
  onAddToCart: (id: number) => void;
}) {
  const signature = expensiveOperation(product.id); // simulates expensive work
  console.log(`ProductCard rendered: ${product.name}`);

  return (
    <div style={{ border: '1px solid #ddd', padding: '12px', margin: '4px', borderRadius: '4px' }}>
      <h4>{product.name}</h4>
      <p>${product.price} — {product.category}</p>
      <small style={{ color: '#aaa' }}>sig: {signature}</small>
      <br />
      <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
    </div>
  );
}

// --- FilterBar ---
// TODO 2: Wrap with React.memo
function FilterBar({
  categories,
  activeCategory,
  onFilterChange,
}: {
  categories: string[];
  activeCategory: string;
  onFilterChange: (cat: string) => void;
}) {
  console.log('FilterBar rendered');
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
      {['All', ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          style={{
            background: activeCategory === cat ? '#0066cc' : '#eee',
            color: activeCategory === cat ? '#fff' : '#333',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// --- Product data ---
const PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', price: 149, category: 'Electronics' },
  { id: 2, name: 'Standing Desk', price: 599, category: 'Furniture' },
  { id: 3, name: 'USB-C Hub', price: 49, category: 'Electronics' },
  { id: 4, name: 'Ergonomic Chair', price: 399, category: 'Furniture' },
  { id: 5, name: 'Monitor Arm', price: 89, category: 'Electronics' },
  { id: 6, name: 'Desk Lamp', price: 65, category: 'Furniture' },
];

const CATEGORIES = ['Electronics', 'Furniture'];

export default function ProductCatalog() {
  const [counter, setCounter] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);

  // TODO 5: Memoize this with useMemo
  const filteredProducts = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  // TODO 3: useCallback — this recreates on every render, breaking ProductCard memo
  const handleAddToCart = (id: number) => {
    console.log(`Added product ${id} to cart`);
    setCartCount((c) => c + 1);
  };

  // TODO 4: useCallback — same problem for FilterBar
  const handleFilterChange = (cat: string) => {
    setActiveCategory(cat);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2>Product Catalog</h2>
        <div>
          <span>Cart: {cartCount} items</span>
          {'  '}
          <button onClick={() => setCounter((c) => c + 1)}>
            Ping Counter: {counter}
          </button>
        </div>
      </div>

      <FilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onFilterChange={handleFilterChange}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
