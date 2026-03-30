import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import AddRounded from "@mui/icons-material/AddRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";


const TopAction = styled.div`display: flex; justify-content: flex-end; margin-bottom: 20px;`;
const AddBtn = styled.button`
  display: flex; align-items: center; gap: 7px;
  background: #EB0029;
  border: none; border-radius: 11px;
  padding: 12px 24px; color: #fff; font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(235, 0, 41, 0.2);
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(235, 0, 41, 0.3); }
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
  width: 100%; min-width: 800px; border-collapse: collapse; background: #ffffff; 
`;
const Th = styled.th`
  text-align: left; padding: 16px 22px; color: #999; font-size: 11.5px; font-weight: 700; 
  text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid rgba(0,0,0,0.05);
  background: #fafafa;
`;
const Td = styled.td`
  padding: 16px 22px; color: #444; font-size: 13.5px; border-bottom: 1px solid rgba(0,0,0,0.03);
  vertical-align: middle;
`;
const Img = styled.img`width: 50px; height: 50px; border-radius: 11px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.05);`;
const Tag = styled.span`background: rgba(235, 0, 41, 0.08); color: #EB0029; border-radius: 50px; padding: 3px 10px; font-size: 11px; font-weight: 700; margin-right: 5px;`;
const IconBtn = styled.button`
  background: ${({ danger }) => danger ? "rgba(235,0,41,0.08)" : "rgba(0,0,0,0.04)"};
  border: none; border-radius: 9px; padding: 9px; cursor: pointer;
  color: ${({ danger }) => danger ? "#EB0029" : "#666"};
  transition: all 0.2s; margin-left: 7px;
  &:hover { transform: scale(1.1); background: ${({ danger }) => danger ? "rgba(235,0,41,0.15)" : "rgba(0,0,0,0.08)"}; }
`;

// Modal
const Overlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 999; backdrop-filter: blur(6px);`;
const Modal = styled.div`
  background: #ffffff; border-radius: 22px; padding: 36px; 
  width: 90%; max-width: 540px; 
  max-height: 90vh; overflow-y: auto; 
  box-shadow: 0 20px 60px rgba(0,0,0,0.15); position: relative; border: 1px solid rgba(0,0,0,0.05);
  @media (max-width: 640px) { padding: 24px; }
`;
const ModalTitle = styled.h2`color: #222; font-size: 21px; font-weight: 800; margin: 0 0 28px; letter-spacing: -0.5px;`;
const CloseBtn = styled.button`position: absolute; top: 22px; right: 22px; background: #f5f5f5; border: none; border-radius: 11px; padding: 7px; cursor: pointer; color: #999; &:hover { color: #333; } @media (max-width: 640px) { top: 15px; right: 15px; }`;
const FormRow = styled.div`display: flex; gap: 18px; @media (max-width: 640px) { flex-direction: column; gap: 0; }`;
const Group = styled.div`display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; flex: 1;`;
const LabelM = styled.label`font-size: 11.5px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.5px;`;
const InputM = styled.input`
  background: #fdfdfd; border: 1px solid #eee; border-radius: 11px;
  padding: 12px 16px; color: #333; font-size: 13.5px; outline: none; transition: all 0.2s;
  &:focus { border-color: #EB0029; box-shadow: 0 0 0 4px rgba(235, 0, 41, 0.05); }
  &::placeholder { color: #bbb; }
`;
const TextareaM = styled.textarea`
  background: #fdfdfd; border: 1px solid #eee; border-radius: 11px;
  padding: 12px 16px; color: #333; font-size: 13.5px; outline: none; resize: vertical; min-height: 90px; transition: all 0.2s;
  &:focus { border-color: #EB0029; box-shadow: 0 0 0 4px rgba(235, 0, 41, 0.05); }
  &::placeholder { color: #bbb; }
`;
const SaveBtn = styled.button`
  width: 100%; background: #EB0029; border: none; border-radius: 12px;
  padding: 14px; color: #fff; font-size: 14.5px; font-weight: 800; cursor: pointer; margin-top: 10px;
  box-shadow: 0 6px 18px rgba(235, 0, 41, 0.22);
  transition: all 0.3s;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(235, 0, 41, 0.3); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ADMIN_API = `${process.env.REACT_APP_API_URL}admin`;
const blank = { name: "", desc: "", img: "", category: [], price: { org: "", mrp: "", off: "" }, ingredients: [] };

const AdminDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("admin-token");
  const cfg = { headers: { Authorization: `Bearer ${token}` } };

  const load = () => {
    console.log("Loading dishes from:", `${ADMIN_API}/dishes`);
    axios.get(`${ADMIN_API}/dishes`, cfg).then(r => setDishes(r.data)).catch(err => {
      console.error("Load error:", err.response?.data || err.message);
    });
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = (d) => {
    setEditing(d._id);
    setForm({
      name: d.name, desc: d.desc, img: d.img,
      category: d.category || [],
      price: { org: d.price?.org, mrp: d.price?.mrp, off: d.price?.off },
      ingredients: d.ingredients || [],
    });
    setModal(true);
  };
  const closeMod = () => { setModal(false); setEditing(null); setForm(blank); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        f("img", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      category: typeof form.category === "string" ? form.category.split(",").map(s => s.trim()) : form.category,
      ingredients: typeof form.ingredients === "string" ? form.ingredients.split(",").map(s => s.trim()) : form.ingredients,
      price: { org: parseFloat(form.price.org), mrp: parseFloat(form.price.mrp), off: parseFloat(form.price.off) },
    };
    try {
      if (editing) await axios.put(`${ADMIN_API}/dishes/${editing}`, payload, cfg);
      else await axios.post(`${ADMIN_API}/dishes`, payload, cfg);
      closeMod(); load();
    } catch (e) { 
      console.error("Save error:", e.response?.data || e.message);
      alert(e.response?.data?.message || "Error saving dish"); 
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    console.log("Deleting dish ID:", id);
    try {
      const res = await axios.delete(`${ADMIN_API}/dishes/${id}`, cfg);
      console.log("Delete response:", res.data);
      load();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete dish. Check console for details.");
    }
  };

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const fp = (field, val) => setForm(p => ({ ...p, price: { ...p.price, [field]: val } }));

  return (
    <AdminLayout title="Food Inventory">
      <TopAction>
        <AddBtn onClick={openAdd}><AddRounded /> Add New Dish</AddBtn>
      </TopAction>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Product Details</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Discount</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {dishes.length === 0 ? (
              <tr><Td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#bbb" }}>No dishes found. Add your first item!</Td></tr>
            ) : dishes.map(d => (
              <tr key={d._id}>
                <Td><Img src={d.img} alt={d.name} onError={e => e.target.src = "https://via.placeholder.com/56"} /></Td>
                <Td>
                  <div style={{ fontWeight: 700, color: "#222" }}>{d.name}</div>
                  <div style={{ fontSize: "12px", color: "#999", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.desc}</div>
                </Td>
                <Td>{(d.category || []).map(c => <Tag key={c}>{c}</Tag>)}</Td>
                <Td>
                  <div style={{ color: "#EB0029", fontWeight: 800 }}>${d.price?.org}</div>
                  <div style={{ color: "#bbb", textDecoration: "line-through", fontSize: "12px" }}>${d.price?.mrp}</div>
                </Td>
                <Td><span style={{ color: "#10b981", fontWeight: 700 }}>{d.price?.off}% OFF</span></Td>
                <Td>
                  <IconBtn onClick={() => openEdit(d)}><EditRounded style={{ fontSize: 20 }} /></IconBtn>
                  <IconBtn danger onClick={() => handleDelete(d._id, d.name)}><DeleteRounded style={{ fontSize: 20 }} /></IconBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      {modal && (
        <Overlay onClick={closeMod}>
          <Modal onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={closeMod}><CloseRounded /></CloseBtn>
            <ModalTitle>{editing ? "Edit Dish Details" : "Add New Dish to Menu"}</ModalTitle>
            <Group><LabelM>Dish Name</LabelM><InputM placeholder="e.g. Classic Cheeseburger" value={form.name} onChange={e => f("name", e.target.value)} /></Group>
            <Group><LabelM>Full Description</LabelM><TextareaM placeholder="Describe the flavors, size, etc..." value={form.desc} onChange={e => f("desc", e.target.value)} /></Group>
            <Group>
              <LabelM>High-Quality Image URL or Upload</LabelM>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <InputM placeholder="https://... or choose file" value={form.img.startsWith('data:image') ? 'Linked Base64 Image' : form.img} onChange={e => f("img", e.target.value)} style={{ flex: 1 }} />
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                <label htmlFor="fileInput" style={{ background: '#eee', padding: '12px 16px', borderRadius: '11px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 'bold' }}>Browse</label>
              </div>
            </Group>
            <Group><LabelM>Categories (comma-separated)</LabelM><InputM placeholder="Burgers, Pizzas" value={Array.isArray(form.category) ? form.category.join(", ") : form.category} onChange={e => f("category", e.target.value)} /></Group>
            <Group><LabelM>Ingredients (comma-separated)</LabelM><InputM placeholder="Cheese, Beef, Lettuce" value={Array.isArray(form.ingredients) ? form.ingredients.join(", ") : form.ingredients} onChange={e => f("ingredients", e.target.value)} /></Group>
            <FormRow>
              <Group><LabelM>Selling Price ($)</LabelM><InputM type="number" placeholder="12.99" value={form.price.org} onChange={e => fp("org", e.target.value)} /></Group>
              <Group><LabelM>Original MRP ($)</LabelM><InputM type="number" placeholder="15.99" value={form.price.mrp} onChange={e => fp("mrp", e.target.value)} /></Group>
              <Group><LabelM>Discount (%)</LabelM><InputM type="number" placeholder="19" value={form.price.off} onChange={e => fp("off", e.target.value)} /></Group>
            </FormRow>
            <SaveBtn onClick={handleSave} disabled={saving}>{saving ? "Processing..." : editing ? "Update Dish" : "Publish Dish"}</SaveBtn>
          </Modal>
        </Overlay>
      )}
    </AdminLayout>
  );
};

export default AdminDishes;
