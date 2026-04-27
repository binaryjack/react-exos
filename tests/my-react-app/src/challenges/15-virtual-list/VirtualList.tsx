import React, { useState, useRef } from 'react';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement a virtual list for 10,000 items.
 * 2. Only render items currently visible in the scroll container.
 * 3. Use absolute positioning or transforms to place items.
 */

const ITEM_HEIGHT = 50;
const CONTAINER_HEIGHT = 400;
const TOTAL_ITEMS = 10000;

export default function VirtualList() {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // TODO: Calculate startIndex and endIndex
  const startIndex = 0;
  const endIndex = 10;

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      <div key={i} style={{
        position: 'absolute',
        top: i * ITEM_HEIGHT,
        height: ITEM_HEIGHT,
        width: '100%',
        borderBottom: '1px solid #eee'
      }}>
        Item #{i}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Virtual List ({TOTAL_ITEMS} items)</h1>
      
      <div 
        ref={containerRef}
        onScroll={onScroll}
        style={{ height: CONTAINER_HEIGHT, overflowY: 'auto', position: 'relative', border: '1px solid #000' }}
      >
        {/* Spacer to simulate total height */}
        <div style={{ height: TOTAL_ITEMS * ITEM_HEIGHT }} />
        
        {/* Render only visible items */}
        {visibleItems}
      </div>
    </div>
  );
}
