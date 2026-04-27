export interface Item {
  id: number;
  name: string;
  category: string;
  value: number;
}

export const generateItems = (count: number): Item[] => {
  const categories = ['Electronics', 'Books', 'Home', 'Garden', 'Fashion'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    category: categories[i % categories.length],
    value: Math.floor(Math.random() * 1000),
  }));
};
