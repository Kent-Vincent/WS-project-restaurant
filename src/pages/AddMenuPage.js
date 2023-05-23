import { useState } from 'react';
import { useRouter } from 'next/router';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebase from '../config/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMenuPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const menuItem = {
      name,
      description,
      price,
      imagePath: null
    };

    // Upload the image file to storage
    const storage = getStorage(firebase);
    const fileRef = storageRef(storage, `menu/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(fileRef, imageFile);
    await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {},
        reject,
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          menuItem.imagePath = imageUrl;

          // Get a reference to the Firebase real-time database
          const database = getDatabase();

          // Push the menu item to the "menu" collection
          push(ref(database, 'menu'), menuItem);

          // Clear the form fields
          setName('');
          setDescription('');
          setPrice('');
          setImageFile(null);

          // Show success toast notification
          toast.success('File uploaded successfully');

          // Redirect to the homepage after a short delay
          setTimeout(() => {
            router.push('/');
          }, 1000);

          resolve();
        }
      );
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">Add Menu Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="font-semibold text-black">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
          />
        </div>
        <div>
          <label htmlFor="description" className="font-semibold text-black">
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
          />
        </div>
        <div>
          <label htmlFor="price" className="font-semibold text-black">
            Price
          </label>
          <input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
          />
        </div>
        <div>
          <label htmlFor="image" className="font-semibold text-black">
            Select an Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddMenuPage;