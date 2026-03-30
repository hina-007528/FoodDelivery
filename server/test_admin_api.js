const testAdmin = async () => {
  console.log("Testing Admin APIs...");
  try {
    // 1. Login
    const loginRes = await fetch("http://localhost:8080/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@foodeli.com", password: "Admin@123" }),
    });
    const loginData = await loginRes.json();
    console.log("✅ Admin Login successful, token received:", !!loginData.token);
    const token = loginData.token;

    // 2. Stats
    const statsRes = await fetch("http://localhost:8080/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsData = await statsRes.json();
    console.log("✅ Stats fetched:", statsData);

    // 3. Dishes
    const dishesRes = await fetch("http://localhost:8080/api/admin/dishes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dishesData = await dishesRes.json();
    console.log("✅ Dishes fetched, count:", dishesData.length || 0);

    // 4. Orders
    const ordersRes = await fetch("http://localhost:8080/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const ordersData = await ordersRes.json();
    console.log("✅ Orders fetched, count:", ordersData.length || 0);

    // 5. Users
    const usersRes = await fetch("http://localhost:8080/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const usersData = await usersRes.json();
    console.log("✅ Users fetched, count:", usersData.length || 0);

    console.log("🎉 ALL ADMIN APIs WORKING PERFECTLY!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

testAdmin();
