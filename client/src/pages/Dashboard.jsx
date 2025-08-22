import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useUser } from '../context/useUser';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.log(err)
        navigate('/');
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      }
    };
    fetchApplications();
  }, []);

  const handleSignOut = async () => {
    await api.post('/auth/logout');
    navigate('/');
  };

  const handleStartNewApplication = async () => {
    try {
      const res = await api.post('/applications/draft'); // expects backend to return { id: ... }
      const applicationId = res.data.id;
      console.log('Created new application with ID:', applicationId);
      navigate(`/new-application/${applicationId}`);
    } catch (err) {
      console.error('Failed to create new application:', err);
      alert('Could not start a new application. Please try again.');
    }
  };

  // Fetch and view/edit application
  const handleViewEditApplication = async (id) => {
    try {
      const res = await api.get(`/applications/${id}`);
      navigate(`/new-application/${id}`, { state: { application: res.data } });
    } catch (err) {
      alert('Could not fetch application.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}

      <section className="w-full max-w-2xl mt-8 mb-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Claim #</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-t">
                  <td className="p-2">{app.claimNumber || app.id}</td>
                  <td className="p-2">{app.status}</td>
                  <td className="p-2">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleViewEditApplication(app.id)}
                    >
                      View/Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        Sign Out
      </button>

      <button
        onClick={handleStartNewApplication}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Start a new application
      </button>
    </div>
  );
};

export default Dashboard;
