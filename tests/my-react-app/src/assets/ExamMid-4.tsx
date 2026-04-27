//--------------------EXERCICE 4----------------------
import { useCallback, useEffect, useMemo, useState } from 'react';

interface IProduct {
  id: number;
  name: string;
  price: number;
}
type TProd = Record<number, IProduct>;

const prices: number[] = [
  23.3, 33.8, 20.45, 10, 4.5, 4, 60, 3, 2, 45, 45.9, 99, 100,
];

const productsApi = () =>
  new Promise<IProduct[]>((resolve) => {
    const output: IProduct[] = [];
    for (let i = 0; i < 13; i++) {
      output.push({ id: i, name: `product-name-${i}`, price: prices[i] });
    }
    resolve(output);
  });

export function Cart() {
  const [products, setProducts] = useState<TProd>({});
  /**stable */
  const fetchProducts = useCallback(async () => {
    const response = await productsApi();
    const productsConverted = Object.fromEntries(
      Object.entries(response).map((o) => [o[1].id, o[1]])
    );
    setProducts(productsConverted);
  }, []);

  useEffect(() => {
    fetchProducts();
    return () => {
      /**cleanup as needed  */
    };
  }, [fetchProducts]);

  const total = useMemo(
    () =>
      Object.values(products)
        .map((o) => o.price)
        .reduce<number>((acc, prce) => (acc += prce), 0),
    [products]
  );

  return (
    <div>
      <h3>Cart</h3>
      <div>
        {Object.values(products).map((p: IProduct) => {
          return (
            <div key={p.id}>
              <div>
                {p.name} <b>$ {p.price}</b>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <div>
        TOTAL: <b>$ {total.toFixed(2)}</b>
      </div>
    </div>
  );
}
