const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAEKHWdRyzI8WyBeGeesjDrM-nEzOXCuNk",
  authDomain: "billion1-a9324.firebaseapp.com",
  projectId: "billion1-a9324",
  storageBucket: "billion1-a9324.firebasestorage.app",
  messagingSenderId: "443716692865",
  appId: "1:443716692865:web:96813fe32a44f8342cd680",
  measurementId: "G-FE7NFHY5PG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addData(data1) {
  try {
    const docRef = await addDoc(collection(db, "users"), data1);
    console.log("✨ Document written with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Error adding document:", e);
    throw e;
  }
}

async function readData(filterField = null, filterValue = null) {
  try {
    const usersRef = collection(db, "users");
    let q = usersRef;

    if (filterField && filterValue) {
      q = query(usersRef, where(filterField, "==", filterValue));
    }

    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("📚 Retrieved documents:", documents.length);
    return documents;
  } catch (e) {
    console.error("❌ Error reading documents:", e);
    throw e;
  }
}

async function searchData(field, searchValue) {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where(field, ">=", searchValue),
      where(field, "<=", searchValue + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("🔍 Search results:", documents.length);
    return documents;
  } catch (e) {
    console.error("❌ Error searching documents:", e);
    throw e;
  }
}

async function deleteData(field, value) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);

    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, "users", document.id)));
    });

    await Promise.all(deletePromises);
    console.log("🗑️ Deleted documents:", deletePromises.length);
    return deletePromises.length;
  } catch (e) {
    console.error("❌ Error deleting documents:", e);
    throw e;
  }
}

async function updateData(field, value, updateFields) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);

    const updatePromises = [];
    querySnapshot.forEach((document) => {
      updatePromises.push(
        updateDoc(doc(db, "users", document.id), updateFields)
      );
    });

    await Promise.all(updatePromises);
    console.log("📝 Updated documents:", updatePromises.length);
    return updatePromises.length;
  } catch (e) {
    console.error("❌ Error updating documents:", e);
    throw e;
  }
}

module.exports = {
  addData,
  readData,
  searchData,
  deleteData,
  updateData,
};
