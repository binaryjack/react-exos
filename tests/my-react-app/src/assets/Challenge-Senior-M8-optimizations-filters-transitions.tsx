import {
  memo,
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';

interface IProduct {
  id: number;
  price: number;
  name: string;
}
const newProduct = (id: number, price: number, name: string): IProduct => {
  return {
    id: id,
    price: price,
    name: name,
  };
};

const getRandomInt = (min: number, max: number): number => {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
};

const productNames: string[] = [
  'computer',
  'roller',
  'mixer',
  'mice',
  'usb-cable',
  'printer',
  'pen',
  'controller',
  'screen',
  'beamer',
  'headset',
];

export const ProductApiCall = (delay?: number) =>
  new Promise<IProduct[]>((resolve, reject) => {
    try {
      console.log('is loading...');
      const products: IProduct[] = [];
      for (let i = 0; i < 100; i++) {
        const price = getRandomInt(150, 2300);
        const product = `${productNames[getRandomInt(0, productNames.length - 1)]}-M${getRandomInt(1, 20)}`;
        products.push(newProduct(i, price, product));
      }
      const to = setTimeout(() => {
        console.log('loaded');
        resolve(products);
        clearTimeout(to);
      }, delay ?? 300);
    } catch {
      reject([]);
    }
  });

interface IApiProducts {
  isLoading: boolean;
  localProducts: IProduct[];
}

export const useApiProducts = (): IApiProducts => {
  const [localProducts, setLocalProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const get = useCallback(() => {
    setIsLoading(true);
    setLocalProducts([]);
    ProductApiCall(400).then((items) => {
      setLocalProducts(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    get();
  }, [get]);

  return { localProducts, isLoading };
};

type PType = Record<number, IProduct>;

export const utils = {
  toRecord: (products: IProduct[]): PType => {
    const output: PType = Object.fromEntries(products.map((o) => [o.id, o]));
    return output;
  },
  toArray: (records: PType): IProduct[] => {
    return Object.values(records);
  },
};

interface IProductProps {
  product: IProduct;
  update?: (id: IProduct['id'], name: IProduct['name']) => void;
  select?: (product: IProduct) => void;
}

interface IProductsListProps {
  products: PType;
  update?: (id: IProduct['id'], name: IProduct['name']) => void;
  select?: (product: IProduct) => void;
}

const ProductItem = memo(({ product, select, update }: IProductProps) => {
  const inputId = `${product.id}-item`;
  const handleSelect = useCallback(() => select?.(product), [select, product]);
  const handleUpdate = useCallback(
    (name: IProduct['name']) => update?.(product.id, name),
    [update, product.id]
  );

  console.log('render Products Items', product.id);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <span onClick={select ? handleSelect : undefined}>{product.name}</span>
      <label htmlFor={inputId}> edit Name</label>
      {update ? (
        <input
          id={inputId}
          value={product.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleUpdate(e.currentTarget.value)
          }
        />
      ) : (
        <></>
      )}
      <span>${product.price}</span>
    </div>
  );
});

const ProductsList = memo(
  ({ products, select, update }: IProductsListProps) => {
    const handleSelect = useCallback(
      (product: IProduct) => select?.(product),
      [select]
    );
    const handleUpdate = useCallback(
      (id: IProduct['id'], name: IProduct['name']) => update?.(id, name),
      [update]
    );

    console.log('render Products List');
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {Object.values(products).map((prod: IProduct) => {
          return (
            <ProductItem
              key={prod.id}
              product={prod}
              select={select && handleSelect}
              update={update && handleUpdate}
            />
          );
        })}
      </div>
    );
  }
);

interface IProductState {
  isLoaded: boolean;
  products: PType;
  selectedProduct: IProduct | null;
}

const INITIAL_STATE: IProductState = {
  isLoaded: false,
  products: {},
  selectedProduct: null,
};

let CURRENT_STATE: IProductState = { ...INITIAL_STATE };
const _listeners = new Set<() => void>();

interface IStore {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => IProductState;
  init: (products: IProduct[]) => void;
  update: (products: { id: number; name: string }) => void;
  select: (products: IProduct | null) => void;
}

const Store: IStore = {
  subscribe: (callback: () => void) => {
    _listeners.add(callback);
    return () => _listeners.delete(callback);
  },
  getSnapshot: (): IProductState => {
    return CURRENT_STATE;
  },
  init: (products: IProduct[]) => {
    CURRENT_STATE = {
      ...CURRENT_STATE,
      isLoaded: true,
      products: {
        ...utils.toRecord(products),
      },
    };
    _listeners.forEach((l) => l());
  },
  update: (payload: { id: number; name: string }) => {
    const { id, name } = payload;
    CURRENT_STATE = {
      ...CURRENT_STATE,
      products: {
        ...CURRENT_STATE.products,
        [id]: { ...CURRENT_STATE.products[id], name },
      },
    };
    _listeners.forEach((l) => l());
  },
  select: (payload: IProduct | null) => {
    CURRENT_STATE = {
      ...CURRENT_STATE,
      selectedProduct: payload,
    };
    _listeners.forEach((l) => l());
  },
};

function useGenericSelector<T>(selector: (state: IProductState) => T): T {
  const state = useSyncExternalStore(
    Store.subscribe,
    Store.getSnapshot,
    () => INITIAL_STATE
  );
  return selector(state);
}

const actions = {
  init: Store.init,
  update: Store.update,
  select: Store.select,
};

const useMyStore = () => {
  return {
    useSelector: useGenericSelector,
    actions,
  };
};
type callbackType = (...args: unknown[]) => void;

const useDebounce = <T extends callbackType>(callback: T, delay: number) => {
  const _timer = useRef<ReturnType<typeof setTimeout>>();
};

const useFilteredProducts = () => {
  const { useSelector } = useMyStore();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<string>('');

  const deferredFilter = useDeferredValue(filter);

  const _products = useSelector((s) => s.products);

  const products = useMemo(() => {
    return Object.fromEntries(
      Object.values(_products)
        .filter((o) => o.name.includes(deferredFilter))
        .map((o) => [o.id, o])
    );
  }, [_products, deferredFilter]);

  const expensiveProducts = useMemo(() => {
    return Object.fromEntries(
      Object.values(_products)
        .filter((p) => p.price > 1000)
        .filter((o) => o.name.includes(deferredFilter))
        .map((o) => [o.id, o])
    );
  }, [_products, deferredFilter]);

  const setFilteredValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentValue = e.currentTarget.value;
      startTransition(() => {
        setFilter(currentValue);
      });
    },
    []
  );

  const handleFilter = useDebounce(() => setFilteredValue, 200);

  return { products, handleFilter, filter, isPending, expensiveProducts };
};

export const ProductsSA3 = () => {
  const { useSelector, actions } = useMyStore();

  const { handleFilter, isPending, filter, products, expensiveProducts } =
    useFilteredProducts();

  const selectedProduct = useSelector((o) => o.selectedProduct);
  const { isLoading, localProducts } = useApiProducts();

  useEffect(() => {
    if (isLoading || localProducts.length === 0) return;
    console.log('first', localProducts.length, isLoading);
    actions.init(localProducts);
  }, [isLoading, localProducts, actions]);

  const handleSelect = useCallback(
    (product: IProduct) => {
      actions.select(product);
    },
    [actions]
  );

  const handleUpdateName = useCallback(
    (id: IProduct['id'], name: IProduct['name']) => {
      actions.update({ id: id, name: name });
    },
    [actions]
  );

  console.log('render Products');

  return (
    <div>
      <h1>Products</h1>
      <div>
        <label htmlFor="filterField">Filter : </label>
        <input
          id="filterField"
          type="text"
          value={filter}
          onChange={handleFilter}
        />
      </div>
      <h2>Expensive Products</h2>
      <Suspense fallback={isPending ? '...loading' : ''}>
        <ProductsList products={expensiveProducts} />
      </Suspense>
      <h2>All Products</h2>
      <Suspense fallback={isPending ? '...loading' : ''}>
        <ProductsList
          products={products}
          select={handleSelect}
          update={handleUpdateName}
        />
      </Suspense>

      {selectedProduct && (
        <div>
          <h2>Selected Product</h2>
          <div>{selectedProduct.name}</div>
        </div>
      )}
    </div>
  );
};
