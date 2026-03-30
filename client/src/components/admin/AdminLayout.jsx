import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import RestaurantMenuRounded from "@mui/icons-material/RestaurantMenuRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import PeopleRounded from "@mui/icons-material/PeopleRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";


const Wrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Inter', sans-serif;
`;
const Sidebar = styled.div`
  width: 234px;
  background: #ffffff;
  border-right: 1px solid rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  z-index: 1000;
  box-shadow: 4px 0 10px rgba(0,0,0,0.02);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 960px) {
    transform: ${({ open }) => open ? "translateX(0)" : "translateX(-100%)"};
    box-shadow: ${({ open }) => open ? "4px 0 20px rgba(0,0,0,0.1)" : "none"};
  }
`;
const SideLogo = styled.div`
  font-size: 21.5px;
  font-weight: 900;
  color: #EB0029;
  padding: 0 25px 28px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 9px;
  span { color: #333; }
`;
const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12.5px;
  padding: 12.5px 25px;
  cursor: pointer;
  color: ${({ active }) => active ? "#EB0029" : "#666"};
  background: ${({ active }) => active ? "rgba(235, 0, 41, 0.08)" : "transparent"};
  border-left: 4px solid ${({ active }) => active ? "#EB0029" : "transparent"};
  font-size: 13.5px;
  font-weight: ${({ active }) => active ? 700 : 500};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover { 
    color: #EB0029; 
    background: rgba(235, 0, 41, 0.04);
  }
  svg { 
    font-size: 20px;
    color: ${({ active }) => active ? "#EB0029" : "#999"};
  }
`;
const Spacer = styled.div`flex: 1;`;
const Main = styled.div`
  margin-left: 234px;
  flex: 1;
  min-width: 0;
  padding: 36px;
  min-height: 100vh;
  background: #f8f9fa;
  @media (max-width: 960px) {
    margin-left: 0;
    padding: 24px;
  }
  @media (max-width: 640px) {
    padding: 16px;
  }
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  @media (max-width: 640px) {
    margin-bottom: 24px;
  }
`;
const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
const MenuBtn = styled.button`
  display: none;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 6px;
  color: #444;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  @media (max-width: 960px) {
    display: flex;
  }
  svg { font-size: 24px; }
`;
const Overlay = styled.div`
  display: none;
  @media (max-width: 960px) {
    display: ${({ open }) => open ? "block" : "none"};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 999;
    backdrop-filter: blur(2px);
  }
`;
const PageTitle = styled.h1`
  color: #222;
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;
const AdminBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 50px;
  padding: 7px 14px;
  color: #444;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  @media (max-width: 480px) {
    padding: 6px 10px;
    span { display: none; }
  }
`;
const Avatar = styled.div`
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EB0029, #ff5370);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 14px; color: #fff;
  box-shadow: 0 4px 10px rgba(235, 0, 41, 0.3);
  flex-shrink: 0;
`;
const nav = [
  { label: "Dashboard", icon: <DashboardRounded />, path: "/admin/dashboard" },
  { label: "Dishes", icon: <RestaurantMenuRounded />, path: "/admin/dishes" },
  { label: "Orders", icon: <ReceiptLongRounded />, path: "/admin/orders" },
  { label: "Users", icon: <PeopleRounded />, path: "/admin/users" },
];

const AdminLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem("admin-user") || "{}");

  const logout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-user");
    navigate("/admin/login");
  };

  return (
    <Wrap>
      <Overlay open={mobileOpen} onClick={() => setMobileOpen(false)} />
      <Sidebar open={mobileOpen}>
        <SideLogo>🍔 <span>Foodeli</span> Admin</SideLogo>
        {nav.map(n => (
          <NavItem key={n.path} active={location.pathname === n.path} onClick={() => { navigate(n.path); setMobileOpen(false); }}>
            {n.icon} {n.label}
          </NavItem>
        ))}
        <Spacer />
        <NavItem onClick={logout} style={{ borderTop: "1px solid rgba(0,0,0,0.05)", borderLeft: "none" }}>
          <LogoutRounded /> Sign Out
        </NavItem>
      </Sidebar>
      <Main>
        <TopBar>
          <TopBarLeft>
            <MenuBtn onClick={() => setMobileOpen(true)}><MenuRounded /></MenuBtn>
            <PageTitle>{title}</PageTitle>
          </TopBarLeft>
          <AdminBadge>
            <Avatar>{(adminUser.name || "A")[0].toUpperCase()}</Avatar>
            <span>{adminUser.name || "Admin"}</span>
          </AdminBadge>
        </TopBar>
        {children}
      </Main>
    </Wrap>
  );
};

export default AdminLayout;
