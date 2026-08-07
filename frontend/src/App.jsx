import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import FarmerDashboard from './pages/FarmerDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import MarketPrices from './pages/MarketPrices';
import MyOrders from './pages/MyOrders';
import Messages from './pages/Messages';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/market-prices" element={<MarketPrices />} />

          {/* Any logged-in buyer or farmer */}
          <Route
            path="/orders"
            element={
              <PrivateRoute roles={['buyer', 'farmer']}>
                <MyOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute roles={['buyer', 'farmer']}>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages/:conversationId"
            element={
              <PrivateRoute roles={['buyer', 'farmer']}>
                <Messages />
              </PrivateRoute>
            }
          />

          {/* Farmer only */}
          <Route
            path="/farmer/dashboard"
            element={
              <PrivateRoute roles={['farmer']}>
                <FarmerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/farmer/products/add"
            element={
              <PrivateRoute roles={['farmer']}>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/farmer/products/:id/edit"
            element={
              <PrivateRoute roles={['farmer']}>
                <EditProduct />
              </PrivateRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      </SocketProvider>
    </AuthProvider>
  );
}
