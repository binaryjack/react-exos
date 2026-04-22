import { useCallback, useMemo, useState } from 'react';

export const ParentCounter = () => {
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>('');

  const items = useMemo(() => {
    const newList: string[] = [];
    for (let i = 0; i < 10000; i++) {
      newList.push(`${i}-item`);
      console.log('compute', i);
    }
    console.log('end');
    return newList;
  }, []);

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const handleFileterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

  console.log('rerender parent ');
  return (
    <div>
      <div>Counter ({count})</div>
      <div>Items ({items.length})</div>
      <div>
        <button onClick={handleIncrement}>+</button>
      </div>
      <div className="div">
        <label htmlFor="field-filter">Filter </label>
        <input
          id="field-filter"
          type="text"
          onChange={handleFileterChange}
          value={filter}
        />
      </div>
      <ExpensiveList filter={filter} items={items} />
    </div>
  );
};

interface IExpensiveListProps {
  filter: string;
  items: string[];
}

export const ExpensiveList = ({ items, filter }: IExpensiveListProps) => {
  console.log('rerender child ');
  const filteredItems = useMemo(() => {
    const filteredItems: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const currentItem = items[i];
      if (currentItem.includes(filter)) {
        filteredItems.push(currentItem);
      }
    }
    console.log('reecomputed useMemo filters');
    return filteredItems;
  }, [filter]);
  // const [filteredItems, setFilteredItems] = useState<string[]>([]);

  // const computeFilteredItems = () => {
  //   const filteredItems: string[] = [];
  //   for (let i = 0; i < items.length; i++) {
  //     const currentItem = items[i];
  //     if (currentItem.includes(filter)) {
  //       filteredItems.push(currentItem);
  //     }
  //   }
  //   setFilteredItems(filteredItems);
  // };

  // useEffect(() => {
  //   if (!filter || filter === '') {
  //     setFilteredItems(items);
  //     return;
  //   }
  //   computeFilteredItems();
  // }, [filter, items]);

  return (
    <div className="container">
      <div className="count">Filtered items {filteredItems.length}</div>
      <div className="list">
        {filteredItems.map((item, index) => {
          return <div key={index}>{item}</div>;
        })}
      </div>
    </div>
  );
};
