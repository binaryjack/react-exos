import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import ProductForm from './ProductForm';
import { deleteProductRequest, fetchProductsRequest } from './store/product.slice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProductRequest(id));
    }
  };

  if (loading && products.length === 0) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Product Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="list-container">
          <div className="list-header">
            <h2>Products</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="empty-state">No products found. Create one to get started.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.description}</td>
                    <td className="table-actions">
                      <button
                        className="btn btn-danger"
                        onClick={() => product.id && handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
