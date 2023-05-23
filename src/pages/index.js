import React, { useEffect, useState } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  remove
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import firebase from '../config/firebase.config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import Header from './header/header';

const Home = () => {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    // Get a reference to the Firebase real-time database
    const database = getDatabase();

    // Get the "menu" collection from the database
    const menuRef = ref(database, 'menu');

    // Listen for changes in the menu collection
    onValue(menuRef, async (snapshot) => {
      const data = snapshot.val();

      // Convert the object of menu items into an array
      const items = data ? Object.values(data) : [];

      // Fetch the image URL for each menu item
      const itemsWithImageUrl = await Promise.all(
        items.map(async (item) => {
          if (item.imagePath) {
            const storage = getStorage();
            const storageRefPath = item.imagePath;
            const fileRef = storageRef(storage, storageRefPath);
            const imageUrl = await getDownloadURL(fileRef);
            return { ...item, imageUrl };
          }
          return item;
        })
      );

      // Fetch the menu items with the 'id' field included
      const itemsWithKeyAndImageUrl = itemsWithImageUrl.map((item, index) => ({
      ...item,
     id: Object.keys(data)[index], // Assuming the key is available in 'Object.keys(data)'
    }));

      // Update the state with the menu items
      setMenuItems(itemsWithKeyAndImageUrl);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (item) => {
    try {
      const { id, imagePath } = item;
      const database = getDatabase();
      const storage = getStorage();
  
      // Remove the specified item from the Firebase Realtime Database using the 'id' field
      const itemRef = ref(database, `menu/${id}`);
      await remove(itemRef);

      // Delete the corresponding file from Firebase Storage if 'imagePath' exists
      if (imagePath) {
      const fileRef = storageRef(storage, imagePath);
      await deleteObject(fileRef);
      }

      // Remove the item from the menuItems state
      setMenuItems((prevMenuItems) =>
        prevMenuItems.filter((menuItem) => menuItem.id !== id)
      );
  
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  return (
    <div>
      <Header />
      <div className="flex justify-end mt-10 mr-10">
        {user && (
          <Link href="/add-menu">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Add Menu
            </button>
          </Link>
        )}
      </div>
      <div className="container mx-auto mt-10">
        <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item) => (
        <div key={item.key} className="bg-white rounded shadow p-4 relative">
         <h2 className="text-lg font-semibold mb-2 text-black">
        {item.name}
        <span className="text-red-500 font-semibold float-right">₱{item.price}</span>
        </h2>
         {item.imageUrl && (
        <img
        src={item.imageUrl}
        alt={item.name}
        className="mt-4 w-64 h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-image.jpg'; // Replace with your placeholder image path
          }}
         />
         )}
       <p className="text-gray-600 mb-4">{item.description}</p>
        {user && (
        <div className="absolute bottom-4 right-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          onClick={() => handleDelete(item)}
           >
          Delete
        </button>
       </div>
          )}
        </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
