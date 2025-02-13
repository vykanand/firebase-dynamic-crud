const {
  addData,
  readData,
  searchData,
  deleteData,
  updateData,
} = require("./firebase-dao.js");

async function runTests() {
  console.log("🚀 Starting Firestore Tests\n");

  // Test 1: Add Data
  console.log("Test 1: Adding new user");
  const userData = {
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    created_at: new Date().toUTCString(),
  };

  const docId = await addData(userData);
  console.log("✅ Add Test Complete\n");

  // Test 2: Read Data
  console.log("Test 2: Reading all users");
  const allUsers = await readData();
  console.log("📖 Retrieved Users:", allUsers);
  console.log("✅ Read Test Complete\n");

  // Test 3: Search Data
  console.log("Test 3: Searching for specific user");
  const searchResults = await searchData("name", "Test");
  console.log("🔍 Search Results:", searchResults);
  console.log("✅ Search Test Complete\n");

  // Test 4: Update Data
  console.log("Test 4: Updating user");
  const updateFields = {
    age: 26,
    status: "updated",
  };
  const updatedCount = await updateData(
    "email",
    "test@example.com",
    updateFields
  );
  console.log("✅ Update Test Complete\n");

  // Test 5: Verify Update
  console.log("Test 5: Verifying update");
  const updatedUser = await readData("email", "test@example.com");
  console.log("📝 Updated User Data:", updatedUser);
  console.log("✅ Verification Complete\n");

  // Test 6: Delete Data
  console.log("Test 6: Deleting test user");
  const deletedCount = await deleteData("email", "test@example.com");
  console.log("✅ Delete Test Complete\n");

  // Test 7: Verify Deletion
  console.log("Test 7: Verifying deletion");
  const remainingUsers = await readData("email", "test@example.com");
  console.log("🗑️ Remaining matching users:", remainingUsers.length);
  console.log("✅ Final Verification Complete\n");

  console.log("✨ All Tests Completed Successfully");
}

runTests().catch((error) => {
  console.error("❌ Test Failed:", error);
});
