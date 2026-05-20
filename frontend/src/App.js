import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./context/WishlistContext";
import "leaflet/dist/leaflet.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import UserHome from "./pages/user/Home/Home";

import OurServices from "./pages/user/ServicePage/OurServices";
import ServiceDetails from "./pages/user/ServicePage/ServiceDetails";
import BookService from "./pages/user/ServicePage/BookService";
import AddressPage from "./pages/user/ServicePage/AddressPage";
import WaitingPage from "./pages/user/ServicePage/WaitingPage";
import SuccessPage from "./pages/user/ServicePage/SuccessPage";
import Professionals from "./pages/user/Professionals/Professionals";
import About from "./pages/user/About/About";
import Contact from "./pages/user/Contact/Contact";
// import AuthPage from "./pages/Auth/AuthPage";

import AccountPage from "./pages/user/Account/AccountPage";
import Wishlist from "./pages/user/Account/Wishlist";


import VendorVerification from "./pages/VendorVerification";
import VendorHome from "./pages/vendor/VendorHome";
import VendorProfile from "./pages/vendor/VendorProfile";
import VendorDashboard from "./pages/vendor/Vendordashboard";
import VendorServices from "./pages/vendor/VendorServices";
import AddService from "./pages/vendor/AddService";
import VendorBookings from "./pages/vendor/VendorBookings";
import VendorEarnings from "./pages/vendor/VendorEarnings";
import ServicePerformance from "./pages/vendor/ServicePerformance";
import VendorInvoices from "./pages/vendor/VendorInvoices";

function LayoutWrapper() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/vendor"); // ✅ NEW

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vendor-verification" element={<VendorVerification />} />

        <Route path="/user/home" element={<UserHome />} />
         <Route path="/services" element={<OurServices />} />
  <Route path="/services/:slug" element={<ServiceDetails />} />
  <Route path="/services/:slug/book" element={<BookService />} />
  <Route path="/services/:slug/book/address" element={<AddressPage />} />
  <Route path="/services/:slug/book/waiting" element={<WaitingPage />} />
  <Route path="/services/:slug/book/success" element={<SuccessPage />} />
  <Route path="/professionals" element={<Professionals />} />
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
        {/* <Route path="/auth" element={<AuthPage />} /> */}
        <Route path="/account" element={<AccountPage />} />  
         <Route path="/wishlist" element={<Wishlist/>}/> 



        <Route path="/vendor" element={<VendorDashboard />}>
          <Route index element={<VendorHome />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="dashboard" element={<VendorHome />} />
          <Route path="services" element={<VendorServices />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="bookings" element={<VendorBookings />} />
          <Route path="earnings" element={<VendorEarnings />} />
          <Route path="performance" element={<ServicePerformance />} />
          <Route path="invoices" element={<VendorInvoices />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
function App() {
  return (
    <Router>
<WishlistProvider>
<Toaster
  position="bottom-center"
  toastOptions={{
    style: {
      borderRadius: "10px",
      padding: "12px",
      fontSize: "14px",
    },
  }}
/>
      <LayoutWrapper />

      </WishlistProvider>

    </Router>
  );
}
export default App;
