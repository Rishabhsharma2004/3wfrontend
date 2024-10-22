import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users'); // Changed to GET
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error); // Log error for debugging
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-4xl font-bold text-center mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p>{user.handle}</p>
            <div className="flex flex-wrap mt-3">
              {user.images.map((img, idx) => (
                <img key={idx} src={img} alt="Uploaded" className="w-20 h-20 object-cover rounded-md m-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
