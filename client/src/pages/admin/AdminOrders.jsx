import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

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
  width: 100%; min-width: 900px; border-collapse: collapse; background: #ffffff; 
`;
const Th = styled.th`
  text-align: left; padding: 16px 22px; color: #999; font-size: 11.5px; font-weight: 700; 
  text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(0,0,0,0.05);
  background: #fafafa;
`;
const Td = styled.td`
  padding: 16px 22px; color: #444; font-size: 13.5px; border-bottom: 1px solid rgba(0,0,0,0.03);
  vertical-align: top;
`;
const Badge = styled.span`
  background: rgba(235, 0, 41, 0.08); color: #EB0029; border-radius: 50px; 
  padding: 3px 10px; font-size: 11px; font-weight: 800;
`;
const ItemRow = styled.div`display: flex; align-items: center; gap: 10px; margin-bottom: 9px;`;
const ItemImg = styled.img`width: 40px; height: 40px; border-radius: 9px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.05);`;

const ADMIN_API = `${process.env.REACT_APP_API_URL}admin`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("admin-token");

  useEffect(() => {
    axios.get(`${ADMIN_API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Global Orders">
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Order Info</Th>
              <Th>Customer</Th>
              <Th>Items Ordered</Th>
              <Th>Revenue</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={6} style={{ textAlign: "center", padding: "36px", color: "#bbb" }}>Loading orders data...</Td></tr>
            ) : orders.length === 0 ? (
              <tr><Td colSpan={6} style={{ textAlign: "center", padding: "36px", color: "#bbb" }}>No orders placed yet</Td></tr>
            ) : orders.map(o => (
              <tr key={o._id}>
                <Td><Badge>#{o._id.slice(-6).toUpperCase()}</Badge></Td>
                <Td>
                  <div style={{ fontWeight: 700, color: "#222" }}>{o.user?.name || "Guest"}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>{o.user?.email}</div>
                </Td>
                <Td>
                  {(o.products || []).filter(i => i.product).map(i => (
                    <ItemRow key={i._id}>
                      <ItemImg src={i.product?.img} onError={e => e.target.src = "https://via.placeholder.com/40"} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{i.product?.name}</span>
                        <span style={{ fontSize: 11, color: "#999" }}>Qty: {i.quantity}</span>
                      </div>
                    </ItemRow>
                  ))}
                </Td>
                <Td style={{ color: "#EB0029", fontWeight: 800 }}>${(parseFloat(o.total_amount) || 0).toFixed(2)}</Td>
                <Td style={{ color: "#777", fontSize: 12.5 }}>{new Date(o.createdAt).toLocaleDateString()}</Td>
                <Td>
                   <Badge style={{ 
                      background: o.status === "Delivered" ? "rgba(16, 185, 129, 0.1)" : "rgba(235, 0, 41, 0.1)",
                      color: o.status === "Delivered" ? "#10b981" : "#EB0029"
                    }}>{o.status || "Pending"}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </AdminLayout>
  );
};

export default AdminOrders;
