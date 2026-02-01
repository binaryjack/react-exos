import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import BillForm from './BillForm';
import { deleteBillRequest, fetchBillsRequest } from './store/bill.slice';

const BillList = () => {
  const dispatch = useDispatch();
  const { bills, loading, error } = useSelector((state: RootState) => state.bills);

  useEffect(() => {
    dispatch(fetchBillsRequest());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      dispatch(deleteBillRequest(id));
    }
  };

  if (loading && bills.length === 0) {
    return <div className="loading">Loading bills...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Bill Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="list-container">
          <div className="list-header">
            <h2>Bills</h2>
          </div>
          
          {bills.length === 0 ? (
            <div className="empty-state">No bills found. Create one to get started.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.title}</td>
                    <td>${bill.amount.toFixed(2)}</td>
                    <td>{new Date(bill.date).toLocaleDateString()}</td>
                    <td className="table-actions">
                      <button
                        className="btn btn-danger"
                        onClick={() => bill.id && handleDelete(bill.id)}
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
          <BillForm />
        </div>
      </div>
    </div>
  );
};

export default BillList;
