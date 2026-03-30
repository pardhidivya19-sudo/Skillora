import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";

//service pages
import OurServices from "./pages/ServicePage/OurServices";
import ServiceDetails from "./pages/ServicePage/ServiceDetails";
import BookService from "./pages/ServicePage/BookService";
import AddressPage from "./pages/ServicePage/AddressPage";
import SuccessPage from "./pages/ServicePage/SuccessPage";

import Professionals from "./pages/Professionals/Professionals";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import AuthPage from "./pages/Auth/AuthPage";

import AccountPage from "./pages/Account/AccountPage";
import Wishlist from "./pages/Account/Wishlist";

function Layout() {

  const location = useLocation();

  const hideNavbarFooter = location.pathname === "/auth";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<OurServices />} />
         <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/services/:slug/book" element={<BookService />} />
          <Route path="/services/:slug/book/address" element={<AddressPage />} />
          <Route path="/services/:slug/book/success" element={<SuccessPage />} />

        <Route path="/professionals" element={<Professionals />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/wishlist" element={<Wishlist/>}/>
      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;