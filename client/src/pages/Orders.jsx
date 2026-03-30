import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders } from "../api";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const OrderCard = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20};
  padding-bottom: 10px;
  font-size: 16px;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ProductImg = styled.img`
  height: 60px;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const ProductQuantity = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 18px;
  margin-top: 10px;
`;

const Orders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("krist-app-token");
    if (!token) {
        setLoading(false);
        return;
    }
    try {
      const res = await getOrders(token);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container>
      <Section>
        <Title>Your Orders</Title>
        {loading ? (
          <CircularProgress />
        ) : orders.length === 0 ? (
          <div style={{ color: "#888", fontSize: "18px" }}>No orders yet. Place your first order!</div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <div>Order ID: {order._id.slice(-8).toUpperCase()}</div>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              </OrderHeader>
              {order.products
                .filter((item) => item.product != null)
                .map((item) => (
                  <ProductItem key={item._id}>
                    <ProductImg src={item.product?.img} />
                    <ProductDetails>
                      <ProductName>{item.product?.name}</ProductName>
                      <ProductQuantity>Qty: {item.quantity}</ProductQuantity>
                    </ProductDetails>
                    <div>
                      ${((item.product?.price?.org || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </ProductItem>
                ))}
              <OrderFooter>
                <div>Total Amount</div>
                <div>${(parseFloat(order.total_amount) || 0).toFixed(2)}</div>
              </OrderFooter>
              <div style={{ fontSize: "14px", color: "#888" }}>
                Status: {order.status || "Pending"}
              </div>
            </OrderCard>
          ))
        )}
      </Section>
    </Container>
  );
};

export default Orders;
