import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration (replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyAEKHWdRyzI8WyBeGeesjDrM-nEzOXCuNk",
  authDomain: "billion1-a9324.firebaseapp.com",
  projectId: "billion1-a9324",
  storageBucket: "billion1-a9324.firebasestorage.app",
  messagingSenderId: "443716692865",
  appId: "1:443716692865:web:96813fe32a44f8342cd680",
  measurementId: "G-FE7NFHY5PG",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the collection name from the URL query string (e.g., ?d=users)
const urlParams = new URLSearchParams(window.location.search);
const collectionName = urlParams.get("d") || "users"; // Default to "users" if not found
let fields = []; // Holds the dynamic fields from the collection

// Fetch the schema for the collection to dynamically generate CRUD operations
async function fetchSchema() {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Get the first document's fields for dynamic creation
    const firstDoc = querySnapshot.docs[0].data();
    fields = Object.keys(firstDoc); // Get the field names of the first document
    generateFieldsUI();
  } else {
    alert("No documents found in this collection.");
  }
}

// Generate input fields dynamically based on schema (field names)
function generateFieldsUI() {
  const createFieldsDiv = document.getElementById("createFields");
  const updateFieldsDiv = document.getElementById("updateFields");

  // Clear any existing fields
  createFieldsDiv.innerHTML = "";
  updateFieldsDiv.innerHTML = "";

  fields.forEach((field) => {
    createFieldsDiv.innerHTML += `
          <label for="${field}">${field}</label>
          <input type="text" id="create_${field}" placeholder="Enter ${field}" /><br><br>
        `;
    updateFieldsDiv.innerHTML += `
          <label for="${field}">${field}</label>
          <input type="text" id="update_${field}" placeholder="Enter new ${field}" /><br><br>
        `;
  });
}

// Create an item in the dynamic collection
async function createItem() {
  const docData = {};
  fields.forEach((field) => {
    docData[field] = document.getElementById(`create_${field}`).value;
  });

  if (Object.values(docData).every((value) => value !== "")) {
    try {
      const newDocRef = doc(collection(db, collectionName));
      await setDoc(newDocRef, docData);
      alert("Item created successfully!");
    } catch (error) {
      console.error("Error creating item:", error);
    }
  } else {
    alert("Please fill in all fields.");
  }
}

// Read an item by document ID
// Read an item by document ID
async function readItem() {
  const docId = document.getElementById("readId").value;
  const resultsDiv = document.getElementById("readResults");

  if (docId) {
    try {
      // Use getDoc to get a single document snapshot
      const docRef = doc(db, "users", docId); // Replace "users" with your collection name
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        resultsDiv.innerHTML = "No document found with that ID.";
        return;
      }

      let resultHtml = "<ul>";
      Object.entries(docSnap.data()).forEach(([key, value]) => {
        resultHtml += `<li><strong>${key}:</strong> ${value}</li>`;
      });
      resultHtml += "</ul>";
      resultsDiv.innerHTML = resultHtml;
    } catch (error) {
      console.error("Error reading item:", error);
      resultsDiv.innerHTML = "Error fetching the document.";
    }
  } else {
    alert("Please enter a document ID.");
  }
}

// Update an item by document ID
async function updateItem() {
  const docId = document.getElementById("updateId").value;
  const docData = {};
  fields.forEach((field) => {
    const newValue = document.getElementById(`update_${field}`).value;
    if (newValue) {
      docData[field] = newValue;
    }
  });

  if (docId && Object.keys(docData).length > 0) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, docData);
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  } else {
    alert("Please enter a document ID and at least one field to update.");
  }
}

// Delete an item by document ID
async function deleteItem() {
  const docId = document.getElementById("deleteId").value;

  if (docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  } else {
    alert("Please enter a document ID.");
  }
}

// Add event listeners for all CRUD buttons
document.getElementById("createButton").addEventListener("click", createItem);
document.getElementById("readButton").addEventListener("click", readItem);
document.getElementById("updateButton").addEventListener("click", updateItem);
document.getElementById("deleteButton").addEventListener("click", deleteItem);

// Fetch the schema for the collection when the page loads
fetchSchema();
