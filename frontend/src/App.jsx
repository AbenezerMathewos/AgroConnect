import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyUnitProvider } from './context/CurrencyUnitContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VantaDotsCanvas from './components/VantaDotsCanvas';
import FloatingActionMenu from './components/FloatingActionMenu';



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
    <ThemeProvider>
      <CurrencyUnitProvider>
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

                  {/* Private: Any Authenticated User */}
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <MyOrders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <PrivateRoute>
                        <Messages />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/messages/:id"
                    element={
                      <PrivateRoute>
                        <Messages />
                      </PrivateRoute>
                    }
                  />

                  {/* Farmers & Cooperatives */}
                  <Route
                    path="/farmer/dashboard"
                    element={
                      <PrivateRoute roles={['farmer', 'cooperative']}>
                        <FarmerDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/farmer/add-product"
                    element={
                      <PrivateRoute roles={['farmer', 'cooperative']}>
                        <AddProduct />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/farmer/edit-product/:id"
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
              <FloatingActionMenu />
            </SocketProvider>
          </AuthProvider>
        </LanguageProvider>
      </CurrencyUnitProvider>
    </ThemeProvider>
  );
}
