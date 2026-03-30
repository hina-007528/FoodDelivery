import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const Page = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
`;
const Card = styled.div`
  background: #ffffff;
  border-radius: 22px;
  padding: 50px 42px;
  width: 100%;
  max-width: 396px;
  margin: 0 20px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`;
const Logo = styled.div`
  font-size: 29px;
  font-weight: 900;
  color: #EB0029;
  text-align: center;
  margin-bottom: 7px;
  letter-spacing: -1px;
`;
const Sub = styled.div`
  font-size: 13.5px;
  color: #777;
  text-align: center;
  margin-bottom: 36px;
  font-weight: 500;
`;
const Label = styled.label`
  font-size: 11.5px;
  font-weight: 700;
  color: #555;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 7px;
`;
const Input = styled.input`
  width: 100%;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 11px;
  padding: 14.5px;
  color: #333;
  font-size: 14.5px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 22px;
  transition: all 0.2s;
  &:focus { border-color: #EB0029; box-shadow: 0 0 0 4px rgba(235, 0, 41, 0.05); }
  &::placeholder { color: #ccc; }
`;
const PwdWrap = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 22px;
`;
const PwdInput = styled(Input)`
  margin-bottom: 0;
  padding-right: 45px;
`;
const EyeIcon = styled.div`
  position: absolute;
  right: 14.5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  &:hover { color: #333; }
`;
const Btn = styled.button`
  width: 100%;
  padding: 16px;
  background: #EB0029;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 9px;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(235, 0, 41, 0.25);
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(235, 0, 41, 0.35); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;
const Err = styled.div`
  background: rgba(235, 0, 41, 0.06);
  border: 1px solid rgba(235, 0, 41, 0.15);
  color: #EB0029;
  border-radius: 11px;
  padding: 11px 14.5px;
  font-size: 12.5px;
  margin-bottom: 18px;
  text-align: center;
  font-weight: 600;
`;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}admin/login`, { email, password });
      localStorage.setItem("admin-token", res.data.token);
      localStorage.setItem("admin-user", JSON.stringify(res.data.user));
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Logo>🍔 Foodeli Admin</Logo>
        <Sub>Manage your kitchen with precision</Sub>
        {error && <Err>{error}</Err>}
        <form onSubmit={handleLogin}>
          <Label>Email Address</Label>
          <Input type="email" placeholder="admin@foodeli.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <Label>Password</Label>
          <PwdWrap>
            <PwdInput type={showPwd ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            <EyeIcon onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <VisibilityOff style={{ fontSize: 20 }} /> : <Visibility style={{ fontSize: 20 }} />}
            </EyeIcon>
          </PwdWrap>
          <Btn type="submit" disabled={loading}>{loading ? "Verifying..." : "Access Dashboard"}</Btn>
        </form>
      </Card>
    </Page>
  );
};

export default AdminLogin;
