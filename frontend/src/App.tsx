import { Provider } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import BillList from './pages/bill/BillList';
import ProductList from './pages/product/ProductList';
import UserList from './pages/user/UserList';
import { store } from './store';
import './styles/app.css';
import './styles/reset.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <nav className="nav">
            <Link to="/users">Users</Link>
            <Link to="/bills">Bills</Link>
            <Link to="/products">Products</Link>
          </nav>
          
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/bills" element={<BillList />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
