import React, { useState } from 'react';
import Header from './Header/header.js';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to a success page or navigate to another route
      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-2xl font-bold mb-4 ml-10">Signup</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <div className="mb-4 flex items-center">
            <label htmlFor="email" className="font-semibold mx-3">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-64 ml-7 text-black"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="password" className="font-semibold mx-3">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-64 text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;