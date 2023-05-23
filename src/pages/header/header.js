import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const getEmailUsername = (email) => {
    if (email) {
      const username = email.split('@')[0];
      return username;
    }
    return '';
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <header className="bg-orange-200 py-4 px-8 flex justify-between items-center">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <p className="text-orange-800 font-semibold hover:text-purple-900 transition duration-300">
                Home
              </p>
            </Link>
          </li>
        </ul>
      </nav>
      {user ? (
        <div className="flex items-center">
          <p className="text-orange-800 font-semibold">
            Welcome, {getEmailUsername(user.email)}
          </p>
          <button
            onClick={handleLogout}
            className="text-orange-800 font-semibold hover:text-purple-900 transition duration-300 ml-4"
          >
            Logout
          </button>
        </div>
      ) : (
        <ul className="flex space-x-4">
          <li>
            <Link href="/login">
              <p className="text-orange-800 font-semibold hover:text-purple-900 transition duration-300">
                Login
              </p>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <p className="text-orange-800 font-semibold hover:text-purple-900 transition duration-300">
                Signup
              </p>
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;