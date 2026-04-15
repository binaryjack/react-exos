// Solution: Performance — React.memo + useCallback
//
// Key points:
// - React.memo does a SHALLOW comparison of props by default
// - If a prop is a function/object, it needs a stable reference (useCallback/useMemo)
//   for memo to actually skip re-renders
// - memo alone is NOT enough if callbacks are re-created — memo sees new reference = re-render
// - useMemo for the filtered list: avoids unnecessary array creation on every render
// - useCallback deps: cartCount is NOT a dep of handleAddToCart because we use functional update

import { memo, useCallback, useMemo, useState } from 'react';

function expensiveOperation(id: number): string {
  let result = 0;
  for (let i = 0; i < 50_000; i++) result += i * id;
  return result.toString().slice(-4);
}

// ✅ memo wraps the component
const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: {
  product: { id: number; name: string; price: number; category: string };
  onAddToCart: (id: number) => void;
}) {
  const signature = expensiveOperation(product.id);
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
});

// ✅ memo wraps FilterBar
const FilterBar = memo(function FilterBar({
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
});

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

  // ✅ useMemo — filteredProducts only recomputes when activeCategory changes
  const filteredProducts = useMemo(
    () => activeCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  // ✅ useCallback — no deps: functional update means we don't close over cartCount
  const handleAddToCart = useCallback((id: number) => {
    console.log(`Added product ${id} to cart`);
    setCartCount((c) => c + 1); // functional update — no cartCount dep needed
  }, []); // empty deps = stable reference forever

  // ✅ useCallback — deps: none (setActiveCategory is stable)
  const handleFilterChange = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []); // setActiveCategory is always stable

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

      {/*
        VERIFY IN DEVTOOLS:
        - Click "Ping Counter" → NO ProductCard logs, NO FilterBar log
        - Click a filter → FilterBar re-renders + matching ProductCards re-render
        - Click "Add to Cart" → NO ProductCard re-renders (functional update, stable ref)
      */}
    </div>
  );
}
