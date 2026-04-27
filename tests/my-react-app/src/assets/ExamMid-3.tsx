//--------------------EXERCICE 3----------------------
import { memo, useCallback, useEffect, useState } from 'react';

interface IProduct {
  id: number;
  name: string;
}
type TProd = Record<number, IProduct>;

const productsApi = () =>
  new Promise<IProduct[]>((resolve) => {
    const output: IProduct[] = [];
    for (let i = 0; i < 1000; i++) {
      output.push({ id: i, name: `product-name-${i}` });
    }
    resolve(output);
  });

interface IProductItemProps {
  product: IProduct;
  onSelect: (product: IProduct) => void;
}

const ProductItem = memo(({ product, onSelect }: IProductItemProps) => {
  console.log('render', product.name);
  const handleSelect = useCallback(() => {
    onSelect(product);
  }, [product, onSelect]);
  return (
    <div>
      <span>{product.name}</span>
      <button onClick={handleSelect}>Select</button>
    </div>
  );
});

export function ProductList2() {
  const [products, setProducts] = useState<TProd>({});
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined
  );
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

  console.log('parent rendered');

  /**stable */
  const handleSelect = useCallback((p: IProduct) => {
    setSelectedProduct(p);
  }, []);
  return (
    <div>
      <div>{selectedProduct?.name}</div>
      <div>
        {Object.values(products).map((p: IProduct) => (
          <ProductItem key={p.id} product={p} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
