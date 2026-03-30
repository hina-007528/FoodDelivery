import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lightTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useState } from "react";
import Authentication from "./pages/Authentication";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import { useSelector } from "react-redux";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDishes from "./pages/admin/AdminDishes";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

const Container = styled.div``;

const NavbarWrapper = ({ setOpenAuth, openAuth, currentUser }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  if (isAdminRoute) return null;
  return (
    <Navbar
      setOpenAuth={setOpenAuth}
      openAuth={openAuth}
      currentUser={currentUser}
    />
  );
};

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [openAuth, setOpenAuth] = useState(false);
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <NavbarWrapper
            setOpenAuth={setOpenAuth}
            openAuth={openAuth}
            currentUser={currentUser}
          />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/favorite" exact element={<Favourites />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/dishes/:id" exact element={<FoodDetails />} />
            <Route path="/dishes" exact element={<FoodListing />} />
            <Route path="/orders" exact element={<Orders />} />
            <Route path="/contact" exact element={<Contact />} />
            <Route path="/search" exact element={<Search />} />
            
            {/* Admin Routes */}
            <Route path="/admin" exact element={<AdminLogin />} />
            <Route path="/admin/login" exact element={<AdminLogin />} />
            <Route path="/admin/dashboard" exact element={<AdminDashboard />} />
            <Route path="/admin/dishes" exact element={<AdminDishes />} />
            <Route path="/admin/orders" exact element={<AdminOrders />} />
            <Route path="/admin/users" exact element={<AdminUsers />} />
          </Routes>
          {openAuth && (
            <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
          )}
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
