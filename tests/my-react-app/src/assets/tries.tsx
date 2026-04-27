import { useCallback, useEffect, useState } from 'react';

export const IMailApi = (to: string, delay: number) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('sending mail:', to);
      resolve(true);
    }, delay);
  });

export const IItemsApi = () =>
  new Promise<string[]>((resolve) => {
    const items: string[] = [];
    for (let i = 0; i < 1000; i++) {
      items.push(`item-${i}`);
    }
    setTimeout(() => {
      console.log('fetched items:');
      resolve(items);
    }, 10);
  });

export const CompoMail = () => {
  const [sentMail, setSentMail] = useState<boolean>(false);
  const [items, setItems] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(0);

  const fetchItems = useCallback(async () => {
    const items = await IItemsApi();
    setItems(items);
  }, []);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div>items: {items.length}</div>
      <div>width: {width}</div>
    </div>
  );
};
