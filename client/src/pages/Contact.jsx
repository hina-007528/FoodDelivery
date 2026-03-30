import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { contactUs } from "../api";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";

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
  max-width: 600px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 40px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  text-align: center;
`;

const Contact = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      dispatch(
        openSnackbar({
          message: "Please fill all fields",
          severity: "error",
        })
      );
      return;
    }
    setLoading(true);
    try {
      await contactUs(formData);
      dispatch(
        openSnackbar({
          message: "Message sent successfully!",
          severity: "success",
        })
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      dispatch(
        openSnackbar({
          message: "Failed to send message",
          severity: "error",
        })
      );
    }
    setLoading(false);
  };

  return (
    <Container>
      <Section>
        <Title>Contact Us</Title>
        <TextInput
          label="Name"
          placeholder="Your Name"
          value={formData.name}
          handelChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextInput
          label="Email"
          placeholder="Your Email"
          value={formData.email}
          handelChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextInput
          label="Message"
          placeholder="How can we help?"
          textArea
          rows={5}
          value={formData.message}
          handelChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        <Button
          text="Send Message"
          onClick={handleSubmit}
          isLoading={loading}
          isDisabled={loading}
        />
      </Section>
    </Container>
  );
};

export default Contact;
