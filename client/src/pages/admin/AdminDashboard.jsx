import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import RestaurantMenuRounded from "@mui/icons-material/RestaurantMenuRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import PeopleRounded from "@mui/icons-material/PeopleRounded";
import AttachMoneyRounded from "@mui/icons-material/AttachMoneyRounded";


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 36px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;
const StatCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 20px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.2s;
  &:hover { transform: translateY(-3px); }
  @media (max-width: 480px) {
    padding: 16px 14px;
    border-radius: 14px;
  }
`;
const StatIcon = styled.div`
  font-size: 28px;
  color: ${({ color }) => color};
  background: ${({ bg }) => bg};
  width: 46px; height: 46px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
  svg { font-size: 24px; }
  @media (max-width: 480px) {
    width: 38px; height: 38px;
    svg { font-size: 20px; }
    margin-bottom: 10px;
  }
`;
const StatValue = styled.div`
  font-size: 26px;
  font-weight: 900;
  color: #222;
  letter-spacing: -1px;
  @media (max-width: 480px) { font-size: 20px; }
`;
const StatLabel = styled.div`
  font-size: 11px;
  color: #777;
  margin-top: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionTitle = styled.h2`
  color: #222;
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 22px;
`;
const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.05);
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
`;
const Table = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: #ffffff;
`;
const Th = styled.th`
  text-align: left;
  padding: 16px 22px;
  color: #999;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  background: #fafafa;
`;
const Td = styled.td`
  padding: 16px 22px;
  color: #444;
  font-size: 13.5px;
  font-weight: 500;
  border-bottom: 1px solid rgba(0,0,0,0.03);
`;
const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 11.5px;
  font-weight: 700;
  background: ${({ status }) => 
    status === "Delivered" ? "rgba(16, 185, 129, 0.1)" : 
    status === "Pending" ? "rgba(245, 158, 11, 0.1)" : "rgba(235, 0, 41, 0.1)"};
  color: ${({ status }) => 
    status === "Delivered" ? "#10b981" : 
    status === "Pending" ? "#f59e0b" : "#EB0029"};
`;

const ADMIN_API = `${process.env.REACT_APP_API_URL}admin`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    const cfg = { headers: { Authorization: `Bearer ${token}` } };
    axios.get(`${ADMIN_API}/stats`, cfg).then(r => setStats(r.data)).catch(console.error);
    axios.get(`${ADMIN_API}/orders`, cfg).then(r => setRecentOrders(r.data.slice(0, 8))).catch(console.error);
  }, []);

  const cards = [
    { label: "Total Dishes", value: stats?.totalDishes ?? "0", Icon: RestaurantMenuRounded, color: "#EB0029", bg: "rgba(235, 0, 41, 0.1)" },
    { label: "Total Orders", value: stats?.totalOrders ?? "0", Icon: ReceiptLongRounded, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
    { label: "Total Users", value: stats?.totalUsers ?? "0", Icon: PeopleRounded, color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
    { label: "Total Revenue", value: stats ? `$${Number(stats.totalRevenue).toLocaleString()}` : "$0", Icon: AttachMoneyRounded, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
  ];

  return (
    <AdminLayout title="Dashboard Overview">
      <Grid>
        {cards.map(({ label, value, Icon, color, bg }) => (
          <StatCard key={label}>
            <StatIcon color={color} bg={bg}><Icon /></StatIcon>
            <StatValue>{value}</StatValue>
            <StatLabel>{label}</StatLabel>
          </StatCard>
        ))}
      </Grid>

      <SectionTitle>Recent Activity</SectionTitle>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Total Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr><Td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#bbb" }}>No recent orders found</Td></tr>
            ) : recentOrders.map(o => (
              <tr key={o._id}>
                <Td style={{ fontWeight: 700, color: "#EB0029" }}>#{o._id.slice(-6).toUpperCase()}</Td>
                <Td>{o.user?.name || "Guest User"}</Td>
                <Td>{new Date(o.createdAt).toLocaleDateString()}</Td>
                <Td style={{ fontWeight: 700 }}>${(parseFloat(o.total_amount) || 0).toFixed(2)}</Td>
                <Td><Badge status={o.status || "Pending"}>{o.status || "Pending"}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </AdminLayout>
  );
};

export default AdminDashboard;
