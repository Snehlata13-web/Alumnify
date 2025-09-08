import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const InstitutionDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    institutionId: '',
    name: '',
    address: '',
    departments: [],
    contactEmail: '',
    events: [],
    profilePicture: 'https://via.placeholder.com/150'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [approvedAlumni, setApprovedAlumni] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setShowForm(false);
    }
  }, [profile]);

  const fetchPendingAlumni = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/institution/pending-alumni', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingAlumni(data.pendingAlumni);
      }
    } catch (error) {
      console.error('Error fetching pending alumni:', error);
    }
  };

  const fetchApprovedAlumni = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/institution/approved-alumni', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApprovedAlumni(data.approvedAlumni);
      }
    } catch (error) {
      console.error('Error fetching approved alumni:', error);
    }
  };

  const fetchPendingStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/institution/pending-students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingStudents(data.pendingStudents);
      }
    } catch (error) {
      console.error('Error fetching pending students:', error);
    }
  };

  const fetchApprovedStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/institution/approved-students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApprovedStudents(data.approvedStudents);
      }
    } catch (error) {
      console.error('Error fetching approved students:', error);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchPendingAlumni();
      fetchApprovedAlumni();
      fetchPendingStudents();
      fetchApprovedStudents();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
          setFormData({
            institutionId: data.profile.institutionId || '',
            name: data.profile.name || '',
            address: data.profile.address || '',
            departments: data.profile.departments || [],
            contactEmail: data.profile.contactEmail || '',
            events: data.profile.events || [],
            profilePicture: data.profile.profilePicture || 'https://via.placeholder.com/150'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDepartmentsChange = (e) => {
    const departments = e.target.value.split(',').map(dept => dept.trim()).filter(dept => dept);
    setFormData(prev => ({ ...prev, departments }));
  };

  const handleVerifyAlumni = async (alumniId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/profile/institution/verify-alumni/${alumniId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        fetchPendingAlumni();
        fetchApprovedAlumni();
      }
    } catch (error) {
      console.error('Error verifying alumni:', error);
    }
  };

  const handleVerifyStudent = async (studentId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/profile/institution/verify-student/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        fetchPendingStudents();
        fetchApprovedStudents();
      }
    } catch (error) {
      console.error('Error verifying student:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/institution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setShowForm(false);
        fetchProfile();
      } else {
        setMessage(data.message || 'Error updating profile');
      }
    } catch (error) {
      setMessage('Network error');
    }

    setLoading(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Institution Profile Setup</h1>

          {message && (
            <div className={`mb-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution ID</label>
                <input
                  type="text"
                  name="institutionId"
                  value={formData.institutionId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Departments (comma-separated)</label>
                <input
                  type="text"
                  name="departments"
                  value={formData.departments.join(', ')}
                  onChange={handleDepartmentsChange}
                  placeholder="e.g. CSE, ECE, Mathematics"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Institution Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pending Alumni Requests</h2>
            {pendingAlumni.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pendingAlumni.map((alumni) => (
                  <div key={alumni._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{alumni.user.name}</p>
                      <p className="text-gray-600">{alumni.user.email}</p>
                      <p className="text-sm text-gray-500">{alumni.graduationYear} - {alumni.department}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleVerifyAlumni(alumni._id, 'approve')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyAlumni(alumni._id, 'reject')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Approved Alumni</h2>
            {approvedAlumni.length === 0 ? (
              <p className="text-gray-500">No approved alumni</p>
            ) : (
              <div className="space-y-4">
                {approvedAlumni.map((alumni) => (
                  <div key={alumni._id} className="border rounded-lg p-4">
                    <p className="font-medium">{alumni.user.name}</p>
                    <p className="text-gray-600">{alumni.user.email}</p>
                    <p className="text-sm text-gray-500">{alumni.graduationYear} - {alumni.department}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pending Students</h2>
            {pendingStudents.length === 0 ? (
              <p className="text-gray-500">No pending students</p>
            ) : (
              <div className="space-y-4">
                {pendingStudents.map((student) => (
                  <div key={student._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-sm text-gray-500">Batch {student.batch} - {student.department}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleVerifyStudent(student._id, 'approve')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyStudent(student._id, 'reject')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Approved Students</h2>
            {approvedStudents.length === 0 ? (
              <p className="text-gray-500">No approved students</p>
            ) : (
              <div className="space-y-4">
                {approvedStudents.map((student) => (
                  <div key={student._id} className="border rounded-lg p-4">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-500">Batch {student.batch} - {student.department}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;