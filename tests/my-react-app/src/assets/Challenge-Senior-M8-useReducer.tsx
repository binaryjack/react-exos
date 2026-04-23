import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
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
  /** en prévision d'un retour vers un post ou put API  */
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

/** Il y a du prop drilling su coup je pourrais hypotetiquement passer par un contexte mais c'est pas le sujet ici */
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

/** Il y a du prop drilling su coup je pourrais hypotetiquement passer par un contexte mais c'est pas le sujet ici */
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

enum ActionsMethodNamesEnum {
  UPDATE = 'update',
  SELECT = 'select',
  INIT = 'init',
  ISLOADED = 'isLoaded',
}

type ProductDiscriminatedActions =
  | { type: ActionsMethodNamesEnum.ISLOADED; payload: boolean }
  | {
      type: ActionsMethodNamesEnum.UPDATE;
      payload: {
        id: number;
        name: string;
      };
    }
  | { type: ActionsMethodNamesEnum.INIT; payload: IProduct[] }
  | { type: ActionsMethodNamesEnum.SELECT; payload: IProduct | null };

type productSliceType = (
  state: IProductState,
  action: ProductDiscriminatedActions
) => IProductState;

const productSlice: productSliceType = (
  state: IProductState,
  action: ProductDiscriminatedActions
): IProductState => {
  const type = action.type;
  switch (type) {
    case ActionsMethodNamesEnum.ISLOADED:
      return {
        ...state,
        isLoaded: action.payload,
      };
    case ActionsMethodNamesEnum.INIT:
      return {
        ...state,
        isLoaded: true,
        products: {
          ...utils.toRecord(action.payload),
        },
      };
    case ActionsMethodNamesEnum.UPDATE: {
      const { id, name } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          [id]: { ...state.products[id], name },
        },
      };
    }
    case ActionsMethodNamesEnum.SELECT:
      return {
        ...state,
        selectedProduct: action.payload,
      };

    default: {
      return { ...state };
    }
  }
};

export const ProductsUseReducer = () => {
  const [state, dispatch] = useReducer(productSlice, INITIAL_STATE);

  /** problème 1  on utilise des arrays au lieu de records c'est un référentiel instable! */
  /** Je commence par mocker un service pour que j'aie des données */
  const { isLoading, localProducts } = useApiProducts();

  /** J'ai vu à l'execution que ça coince à plusieurs niveaux, rerenders de l'enfer !
   *  pas de stabilité référentielle et surtout les données ne sont pas affichées correctement car le binding n'est pas bon on a
   * du coup j'ai drastiquement modifié ce composant pour le rendre le plus stable possible d'après ce que j'ai appris mais j'ai peut-être commis des erreurs
   */

  /** j'ai constaté qu'en utilisant use memo ici j'ai un effet local qui ne s'execute que si les dependencies changent et c'est exactement ce que je veux. */
  useEffect(() => {
    if (isLoading || localProducts.length === 0) return;
    console.log('first', localProducts.length, isLoading);
    dispatch({ type: ActionsMethodNamesEnum.INIT, payload: localProducts });
  }, [isLoading, localProducts]);

  const expensiveProducts = useMemo(() => {
    console.log('second');
    return utils.toRecord(
      Object.values(state.products).filter((p) => p.price > 1000)
    );
  }, [state.products]);

  /** j'ai constaté qu'en utilisant use memo ça fonctionne mais c'est peut-être faux en tout cas je n'ai pas de re render inutiles */
  const handleSelect = useCallback((product: IProduct) => {
    dispatch({ type: ActionsMethodNamesEnum.SELECT, payload: product });
  }, []);

  const handleUpdateName = useCallback(
    (id: IProduct['id'], name: IProduct['name']) => {
      dispatch({
        type: ActionsMethodNamesEnum.UPDATE,
        payload: { id: id, name: name },
      });
    },
    []
  );

  console.log('render Products');

  return (
    <div>
      {/** souci: pas de découpage composant ayant trop de responsabilités j'ai donc exporté ce composant j'en ai crée un qui soit réutilisable */}
      <h1>Products</h1>

      <h2>Expensive Products</h2>
      <ProductsList products={expensiveProducts} />

      <h2>All Products</h2>
      {/** souci: pas de découpage composant ayant trop de responsabilités j'ai donc exporté ce composant j'en ai crée un qui soit réutilisable, lorsque je selectionne un item il n'y a que le composant parent qui render
       * lorsque j'update j'ai que l'enfant ciblé qui update mais j'ai toujours la valeur dérivée  expensiveProducts qui se calcule...  ? bug ? normal ? je ne sais pas
       */}
      <ProductsList
        products={state.products}
        select={handleSelect}
        update={handleUpdateName}
      />
      {/** souci: ici ça forçait un render de tous les sous composants alors du coup je l'ai verrouillé dans un useMemo et maintenant je n'ai qu'un render c'est c'est render Products*/}
      {state.selectedProduct && (
        <div>
          <h2>Selected Product</h2>
          <div>{state.selectedProduct.name}</div>
        </div>
      )}
    </div>
  );
};
