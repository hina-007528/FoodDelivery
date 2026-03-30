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
  width: 100%; min-width: 700px; border-collapse: collapse; background: #ffffff; 
`;
const Th = styled.th`
  text-align: left; padding: 16px 22px; color: #999; font-size: 11.5px; font-weight: 700; 
  text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(0,0,0,0.05);
  background: #fafafa;
`;
const Td = styled.td`
  padding: 16px 22px; color: #444; font-size: 13.5px; border-bottom: 1px solid rgba(0,0,0,0.03);
`;
const Badge = styled.span`
  background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50px; 
  padding: 3px 10px; font-size: 11px; font-weight: 700;
`;

const ADMIN_API = `${process.env.REACT_APP_API_URL}admin`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("admin-token");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    axios.get(`${ADMIN_API}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUsers(r.data)).catch(console.error);
  }, []);

  return (
    <AdminLayout title="Registered Users">
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Email Address</Th>
              <Th>Joined Date</Th>
              <Th>Account Role</Th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><Td colSpan={5} style={{ textAlign: "center", padding: "36px", color: "#bbb" }}>No users registered yet</Td></tr>
            ) : users.map((u, i) => (
              <tr key={u._id}>
                <Td style={{ color: "#bbb", fontWeight: 700, fontSize: 12.5 }}>{String(i + 1).padStart(2, '0')}</Td>
                <Td style={{ fontWeight: 700, color: "#222" }}>{u.name}</Td>
                <Td style={{ color: "#666" }}>{u.email}</Td>
                <Td style={{ color: "#999", fontSize: 12.5 }}>{new Date(u.createdAt).toLocaleDateString()}</Td>
                <Td><Badge>{u.role === "admin" ? "Administrator" : "Customer"}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </AdminLayout>
  );
};

export default AdminUsers;
