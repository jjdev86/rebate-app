import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
        return;
      }

      const data = await res.json();
      if (res.ok) setUser(data);
    };

    fetchProfile();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}

      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
