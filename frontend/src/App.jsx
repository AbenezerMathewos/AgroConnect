import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VantaDotsCanvas from './components/VantaDotsCanvas';

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
import FreightSharing from './pages/FreightSharing';
import CropAdvisory from './pages/CropAdvisory';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <VantaDotsCanvas />
          <Navbar />
          <main className="main-content">

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/freight" element={<FreightSharing />} />
              <Route path="/advisory" element={<CropAdvisory />} />

              {/* Logged-in buyer or farmer */}
              <Route
                path="/orders"
                element={
                  <PrivateRoute roles={['buyer', 'farmer', 'cooperative', 'transporter']}>
                    <MyOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PrivateRoute roles={['buyer', 'farmer', 'cooperative', 'transporter']}>
                    <Messages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages/:conversationId"
                element={
                  <PrivateRoute roles={['buyer', 'farmer', 'cooperative', 'transporter']}>
                    <Messages />
                  </PrivateRoute>
                }
              />

              {/* Farmer & Cooperative only */}
              <Route
                path="/farmer/dashboard"
                element={
                  <PrivateRoute roles={['farmer', 'cooperative']}>
                    <FarmerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/farmer/products/add"
                element={
                  <PrivateRoute roles={['farmer', 'cooperative']}>
                    <AddProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/farmer/products/:id/edit"
                element={
                  <PrivateRoute roles={['farmer', 'cooperative']}>
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
    </LanguageProvider>
  );
}

