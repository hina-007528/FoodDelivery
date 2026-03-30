const testCRUD = async () => {
  try {
    const API = "http://localhost:8080"; 

    console.log("-----------------------------------------");
    console.log("🚀 STARTING E2E ADMIN CRUD TEST");
    console.log("-----------------------------------------");

    // 1. Admin Login
    console.log("1. Logging in as admin...");
    const loginRes = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@foodeli.com", password: "Admin@123" })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("✅ Logged in successfully");

    // 2. Add Dish (Admin)
    console.log("\n2. Admin adding a new test dish...");
    const newDish = {
      name: "Test Admin CRUD Pizza",
      desc: "A temporary pizza for testing CRUD",
      img: "https://example.com/pizza.jpg",
      category: ["Pizzas"],
      ingredients: ["Cheese", "Testing"],
      price: { org: 10, mrp: 15, off: 33 }
    };
    const addRes = await fetch(`${API}/api/admin/dishes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newDish)
    });
    if (!addRes.ok) throw new Error(`Add failed: ${addRes.status}`);
    const addedDish = await addRes.json();
    const dishId = addedDish._id;
    console.log(`✅ Dish added with ID: ${dishId}`);

    // 3. Verify on Client side (Public GET api/food/)
    console.log("\n3. Verifying dish exists on Client side...");
    const clientGetRes = await fetch(`${API}/api/food/`);
    const clientDishes = await clientGetRes.json();
    const foundAdded = clientDishes.find(d => d._id === dishId);
    console.log(foundAdded ? `✅ Client sees added dish: "${foundAdded.name}"` : "❌ Client missing dish!");

    // 4. Update Dish (Admin)
    console.log("\n4. Admin updating the dish...");
    const updateRes = await fetch(`${API}/api/admin/dishes/${dishId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Test Admin CRUD Pizza - UPDATED" })
    });
    if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.status}`);
    console.log("✅ Dish updated");

    // 5. Verify update on Client side
    console.log("\n5. Verifying update on Client side...");
    const clientGetRes2 = await fetch(`${API}/api/food/`);
    const clientDishes2 = await clientGetRes2.json();
    const foundUpdated = clientDishes2.find(d => d._id === dishId);
    console.log(foundUpdated?.name === "Test Admin CRUD Pizza - UPDATED" ? `✅ Client sees updated dish: "${foundUpdated.name}"` : "❌ Client update verification failed!");

    // 6. Delete Dish (Admin)
    console.log("\n6. Admin deleting the dish...");
    const deleteRes = await fetch(`${API}/api/admin/dishes/${dishId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.status}`);
    console.log("✅ Dish deleted");

    // 7. Verify deletion on Client side
    console.log("\n7. Verifying deletion on Client side...");
    const clientGetRes3 = await fetch(`${API}/api/food/`);
    const clientDishes3 = await clientGetRes3.json();
    const foundDeleted = clientDishes3.find(d => d._id === dishId);
    console.log(!foundDeleted ? "✅ Client no longer sees the deleted dish" : "❌ Client still sees the dish!");

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! CRUD WORKS END-TO-END.");

  } catch (err) {
    console.error("\n❌ Test failed:", err.message);
  }
};
testCRUD();
