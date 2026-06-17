import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import LatestNews from './pages/LatestNews';
import Promotions from './pages/Promotions';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerPanel from './pages/OwnerPanel';

function OwnerGuard({ children }) {
  const { usuario } = useAuth();
  if (usuario?.rol === 'owner' || usuario?.rol === 'admin') {
    return <Navigate to="/admin/panel" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<OwnerGuard><Home /></OwnerGuard>} />
                <Route path="/catalogo" element={<OwnerGuard><Catalog /></OwnerGuard>} />
                <Route path="/producto/:id" element={<OwnerGuard><ProductDetail /></OwnerGuard>} />
                <Route path="/carrito" element={<OwnerGuard><Cart /></OwnerGuard>} />
                <Route path="/checkout" element={<OwnerGuard><Checkout /></OwnerGuard>} />
                <Route path="/novedades" element={<OwnerGuard><LatestNews /></OwnerGuard>} />
                <Route path="/promociones" element={<OwnerGuard><Promotions /></OwnerGuard>} />
                <Route path="/contacto" element={<OwnerGuard><Contact /></OwnerGuard>} />
                <Route path="/login" element={<OwnerGuard><Login /></OwnerGuard>} />
                <Route path="/registro" element={<OwnerGuard><Register /></OwnerGuard>} />
                <Route path="/mis-pedidos" element={<OwnerGuard><MyOrders /></OwnerGuard>} />
                <Route path="/admin/panel" element={<OwnerPanel />} />
                <Route path="/admin/stock" element={<OwnerDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
