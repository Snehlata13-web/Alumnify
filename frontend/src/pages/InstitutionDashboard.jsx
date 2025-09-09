import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Users,
  GraduationCap,
  Calendar,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit,
  LogOut,
  Building,
  Mail,
  MapPin,
  Plus,
  FileText,
  Hash,
  Globe,
  BookOpen,
  Image,
  Save,
  ArrowRight
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setShowForm(false);
      fetchPendingAlumni();
      fetchApprovedAlumni();
      fetchPendingStudents();
      fetchApprovedStudents();
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

  const filteredAlumni = (alumniList) => {
    return alumniList.filter(alumni =>
      (alumni.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       alumni.user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDepartment === '' || alumni.department.toLowerCase().includes(filterDepartment.toLowerCase()))
    );
  };

  const filteredStudents = (studentList) => {
    return studentList.filter(student =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDepartment === '' || student.department.toLowerCase().includes(filterDepartment.toLowerCase()))
    );
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'alumni', label: 'Alumni', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <Building className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">Institution Profile Setup</h1>
              <p className="text-gray-600 mt-2">Complete your institution profile to get started</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Institution ID</label>
                  <input
                    type="text"
                    name="institutionId"
                    value={formData.institutionId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Departments (comma-separated)</label>
                  <input
                    type="text"
                    name="departments"
                    value={formData.departments.join(', ')}
                    onChange={handleDepartmentsChange}
                    placeholder="e.g. CSE, ECE, Mathematics"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture URL</label>
                  <input
                    type="url"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Events (JSON format)</label>
                  <textarea
                    name="events"
                    value={JSON.stringify(formData.events, null, 2)}
                    onChange={(e) => {
                      try {
                        const events = JSON.parse(e.target.value);
                        setFormData(prev => ({ ...prev, events }));
                      } catch (error) {
                        // Invalid JSON, keep current value
                      }
                    }}
                    placeholder='[{"title": "Annual Alumni Meet", "description": "Annual gathering of alumni", "date": "2024-12-25"}]'
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter events as JSON array. Each event should have title, description, and date fields.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Building className="h-8 w-8 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Institution Overview</h1>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={profile.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Institution"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.contactEmail}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profile.address}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                    <p className="text-2xl font-bold text-gray-900">{approvedAlumni.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Alumni</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingAlumni.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{approvedStudents.length}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Students</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingStudents.length}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('alumni')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Manage Alumni</h4>
                  <p className="text-sm text-gray-600">Review and approve alumni requests</p>
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <GraduationCap className="h-6 w-6 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Manage Students</h4>
                  <p className="text-sm text-gray-600">Review and approve student requests</p>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Manage Events</h4>
                  <p className="text-sm text-gray-600">Create and manage institution events</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Institution Profile</h1>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-indigo-600" />
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Hash className="h-4 w-4 mr-2 text-gray-500" />
                        Institution ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="institutionId"
                          value={formData.institutionId}
                          onChange={handleChange}
                          required
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter institution ID"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        Institution Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter institution name"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Location Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                      Contact & Location
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Contact Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          required
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="contact@institution.edu"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        Address
                      </label>
                      <div className="relative">
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          rows="3"
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                          placeholder="Enter complete institution address"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                      Academic Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      Departments (comma-separated)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="departments"
                        value={formData.departments.join(', ')}
                        onChange={handleDepartmentsChange}
                        placeholder="e.g. Computer Science, Electrical Engineering, Mathematics"
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Separate multiple departments with commas</p>
                  </div>
                </div>

                {/* Media & Events Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Image className="h-5 w-5 mr-2 text-indigo-600" />
                      Media & Events
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Image className="h-4 w-4 mr-2 text-gray-500" />
                        Profile Picture URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          name="profilePicture"
                          value={formData.profilePicture}
                          onChange={handleChange}
                          placeholder="https://example.com/institution-logo.jpg"
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        Events (JSON format)
                      </label>
                      <div className="relative">
                        <textarea
                          name="events"
                          value={JSON.stringify(formData.events, null, 2)}
                          onChange={(e) => {
                            try {
                              const events = JSON.parse(e.target.value);
                              setFormData(prev => ({ ...prev, events }));
                            } catch (error) {
                              // Invalid JSON, keep current value
                            }
                          }}
                          placeholder='[{"title": "Annual Alumni Meet", "description": "Annual gathering of alumni", "date": "2024-12-25"}]'
                          rows="3"
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white font-mono text-sm resize-none"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enter events as JSON array with title, description, and date fields</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white py-3 px-8 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Update Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'alumni' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Alumni Management</h1>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search alumni..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter by department"
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Alumni */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Alumni Requests ({filteredAlumni(pendingAlumni).length})</h2>
              {filteredAlumni(pendingAlumni).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No pending alumni requests</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredAlumni(pendingAlumni).map((alumni) => (
                    <div key={alumni._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={alumni.profilePicture || 'https://via.placeholder.com/150'}
                            alt={alumni.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{alumni.user.name}</h3>
                            <p className="text-gray-600">{alumni.user.email}</p>
                            <p className="text-sm text-gray-500">{alumni.graduationYear} - {alumni.department}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerifyAlumni(alumni._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleVerifyAlumni(alumni._id, 'reject')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Alumni */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Alumni ({filteredAlumni(approvedAlumni).length})</h2>
              {filteredAlumni(approvedAlumni).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No approved alumni</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredAlumni(approvedAlumni).map((alumni) => (
                    <div key={alumni._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={alumni.profilePicture || 'https://via.placeholder.com/150'}
                          alt={alumni.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{alumni.user.name}</h3>
                          <p className="text-gray-600">{alumni.user.email}</p>
                          <p className="text-sm text-gray-500">{alumni.graduationYear} - {alumni.department}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approved
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter by department"
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Students */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Student Requests ({filteredStudents(pendingStudents).length})</h2>
              {filteredStudents(pendingStudents).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No pending student requests</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredStudents(pendingStudents).map((student) => (
                    <div key={student._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-gray-600">{student.email}</p>
                            <p className="text-sm text-gray-500">Batch {student.batch} - {student.department}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerifyStudent(student._id, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleVerifyStudent(student._id, 'reject')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Students */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Students ({filteredStudents(approvedStudents).length})</h2>
              {filteredStudents(approvedStudents).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No approved students</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredStudents(approvedStudents).map((student) => (
                    <div key={student._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-gray-600">{student.email}</p>
                          <p className="text-sm text-gray-500">Batch {student.batch} - {student.department}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approved
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
              <button
                onClick={() => setActiveTab('profile')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Manage Events</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <Calendar className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Institution Events</h3>
                <p className="text-gray-600">Manage your institution's events and activities</p>
              </div>

              {profile?.events && profile.events.length > 0 ? (
                <div className="space-y-4">
                  {profile.events.map((event, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title || 'Untitled Event'}</h4>
                          <p className="text-gray-600 text-sm">{event.description || 'No description'}</p>
                          <p className="text-gray-500 text-sm">{event.date || 'Date not set'}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-800 p-2">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No events added yet</p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Your First Event
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to Add Events</h4>
                <p className="text-blue-700 text-sm">
                  Events can be managed through your profile settings. Go to the Profile tab to add or edit events for your institution.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionDashboard;