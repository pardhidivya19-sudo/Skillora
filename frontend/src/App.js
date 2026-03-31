import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import Services from "./pages/Services";
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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/vendor-verification" element={<VendorVerification />} />

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

    </Router>
  );
}
export default App;
