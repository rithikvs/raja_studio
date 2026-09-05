import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Context Providers
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import WhatsAppFloat from './components/UI/WhatsAppFloat';
import BackToTop from './components/UI/BackToTop';
import LoginModal from './components/UI/LoginModal';

// Public & Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CustomerDashboard from './pages/CustomerDashboard';
import WishlistPage from './pages/WishlistPage';
import MyOrders from './pages/MyOrders';
import PersonalizedGifts from './pages/PersonalizedGifts';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Works from './pages/Works';
import { FAQPage, ShippingPage, ReturnsPage, PrivacyPage, TermsPage } from './pages/PolicyPages';

// Admin Portal
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCustomers from './pages/Admin/AdminCustomers';
import AdminCoupons from './pages/Admin/AdminCoupons';
import AdminCMS from './pages/Admin/AdminCMS';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

// Layout wrapper for customer facing pages (includes header & footer)
const CustomerLayout = () => {
    return (
        <div className="app-container">
            <Navbar />
            <WhatsAppFloat />
            <BackToTop />
            <main style={{ minHeight: '80vh', padding: '0' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
        });
    }, []);

    return (
        <DataProvider>
            <AuthProvider>
                <CartProvider>
                    <AdminProvider>
                        <Router>
                            <ScrollToTop />
                            <Routes>
                                <Route element={<CustomerLayout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/shop" element={<Shop />} />
                                    <Route path="/shop/:id" element={<ProductDetails />} />
                                    <Route path="/product/:id" element={<ProductDetails />} />
                                    <Route path="/personalized-gifts" element={<PersonalizedGifts />} />
                                    <Route path="/categories" element={<Categories />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                                    <Route path="/track-order" element={<TrackOrderPage />} />
                                    <Route path="/dashboard" element={<CustomerDashboard />} />
                                    <Route path="/account" element={<CustomerDashboard />} />
                                    <Route path="/account/orders" element={<MyOrders />} />
                                    <Route path="/wishlist" element={<WishlistPage />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/services" element={<Services />} />
                                    <Route path="/works" element={<Works />} />
                                    <Route path="/faq" element={<FAQPage />} />
                                    <Route path="/shipping" element={<ShippingPage />} />
                                    <Route path="/returns" element={<ReturnsPage />} />
                                    <Route path="/privacy" element={<PrivacyPage />} />
                                    <Route path="/terms" element={<TermsPage />} />
                                    <Route path="*" element={<Home />} />
                                </Route>

                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="products" element={<AdminProducts />} />
                                    <Route path="products/new" element={<AdminProducts />} />
                                    <Route path="categories" element={<AdminCategories />} />
                                    <Route path="orders" element={<AdminOrders />} />
                                    <Route path="customers" element={<AdminCustomers />} />
                                    <Route path="coupons" element={<AdminCoupons />} />
                                    <Route path="cms" element={<AdminCMS />} />
                                </Route>
                            </Routes>
                            <LoginModal />
                        </Router>
                    </AdminProvider>
                </CartProvider>
            </AuthProvider>
        </DataProvider>
    );
}

export default App;
