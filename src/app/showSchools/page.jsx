'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools');
        const data = await response.json();
        if (response.ok) {
          setSchools(data);
          setFilteredSchools(data);
        } else {
          setError(data.error || 'Failed to fetch schools');
        }
      } catch (err) {
        setError('Error fetching schools');
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const filtered = schools.filter((school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  const handleDelete = async (id, imagePath) => {
    if (confirm('Are you sure you want to delete this school?')) {
      try {
        const response = await fetch(`/api/schools?id=${id}&imagePath=${encodeURIComponent(imagePath)}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSchools(schools.filter((school) => school.id !== id));
          setFilteredSchools(filteredSchools.filter((school) => school.id !== id));
        } else {
          alert('Failed to delete school');
        }
      } catch (error) {
        alert('Error deleting school');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading schools...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Our Schools</h1>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by name, city, or state..."
            className="w-full max-w-md p-3 bg-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-center mb-6 font-medium">{error}</p>}
        {filteredSchools.length === 0 && !error ? (
          <p className="text-center text-gray-700 text-lg">No schools found. Add a school to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
              >
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">{school.name}</h2>
                  <p className="text-gray-600 mb-2"><span className="font-medium">Address:</span> {school.address}</p>
                  <p className="text-gray-600 mb-2"><span className="font-medium">City:</span> {school.city}</p>
                  <p className="text-gray-600 mb-2"><span className="font-medium">State:</span> {school.state}</p>
                  <p className="text-gray-600 mb-2"><span className="font-medium">Contact:</span> {school.contact}</p>
                  <p className="text-gray-600 mb-4"><span className="font-medium">Email:</span> {school.email_id}</p>
                  <div className="flex gap-2">
                    <Link href={`/editSchool/${school.id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(school.id, school.image)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition transform hover:scale-105">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}