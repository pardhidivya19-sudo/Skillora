import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Providers from "./pages/Providers";
import ProviderDetails from "./pages/ProviderDetails";
import Bookings from "./pages/Bookings";
import AdminRoute from "./routes/AdminRoutes";
import AdminLayout from "./layout/AdminLayout";
import Payments from "./pages/Payments";
import Withdrawals from "./pages/Withdrawals";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          <Route path="providers/:id" element={<ProviderDetails />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;