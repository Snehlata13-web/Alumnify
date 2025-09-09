import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Users,
  GraduationCap,
  Search,
  MessageCircle,
  BookOpen,
  Award,
  MapPin,
  Calendar,
  CheckCircle,
  LogOut,
  TrendingUp,
  Star,
  Briefcase
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    institutionName: '',
    name: '',
    email: '',
    batch: '',
    department: '',
    skills: [],
    interests: [],
    location: '',
    mentorPreferences: [],
    profilePicture: 'https://via.placeholder.com/150'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.verificationStatus === 'verified') {
      fetchMentors();
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
            institutionName: data.profile.institutionName || '',
            name: data.profile.name || '',
            email: data.profile.email || '',
            batch: data.profile.batch || '',
            department: data.profile.department || '',
            skills: data.profile.skills || [],
            interests: data.profile.interests || [],
            location: data.profile.location || '',
            mentorPreferences: data.profile.mentorPreferences || [],
            profilePicture: data.profile.profilePicture || 'https://via.placeholder.com/150'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/mentors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'batch') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleInterestsChange = (e) => {
    const interests = e.target.value.split(',').map(interest => interest.trim()).filter(interest => interest);
    setFormData(prev => ({ ...prev, interests }));
  };

  const handleMentorPreferencesChange = (e) => {
    const mentorPreferences = e.target.value.split(',').map(pref => pref.trim()).filter(pref => pref);
    setFormData(prev => ({ ...prev, mentorPreferences }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile submitted successfully! Waiting for institution verification.');
        fetchProfile();
      } else {
        setMessage(data.message || 'Error updating profile');
      }
    } catch (error) {
      setMessage('Network error');
    }

    setLoading(false);
  };

  const filteredMentors = mentors.filter(mentor =>
    (mentor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     mentor.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterSkill === '' || mentor.skills.some(skill =>
      skill.toLowerCase().includes(filterSkill.toLowerCase())
    ))
  );

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'mentors', label: 'Find Mentors', icon: Users },
    { id: 'network', label: 'My Network', icon: MessageCircle }
  ];

  if (profile?.verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <GraduationCap className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Pending</h1>
          <p className="text-gray-600 mb-6">
            Your profile has been submitted and is waiting for verification by your institution.
          </p>
          <p className="text-sm text-gray-500 mb-6">Please check back later.</p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  if (profile?.verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Student Hub</h2>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {profile.name}!</h1>

              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.profilePicture || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600">{profile.institutionName}</p>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profile.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                    <p className="text-sm text-gray-500 mt-2">Batch {profile.batch}</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Skills</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.skills?.length || 0}</p>
                    </div>
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mentors Found</p>
                      <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Interests</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.interests?.length || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('mentors')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Users className="h-6 w-6 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Find Mentors</h4>
                    <p className="text-sm text-gray-600">Connect with alumni mentors</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <User className="h-6 w-6 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Update Profile</h4>
                    <p className="text-sm text-gray-600">Keep your profile current</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('network')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <MessageCircle className="h-6 w-6 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">My Network</h4>
                    <p className="text-sm text-gray-600">View your connections</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message}
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name</label>
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Year</label>
                      <input
                        type="number"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        required
                        min="1900"
                        max="2100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma-separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills.join(', ')}
                        onChange={handleSkillsChange}
                        placeholder="e.g. Python, AI, Machine Learning"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Interests (comma-separated)</label>
                      <input
                        type="text"
                        name="interests"
                        value={formData.interests.join(', ')}
                        onChange={handleInterestsChange}
                        placeholder="e.g. Data Science, Cloud Computing"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mentor Preferences (comma-separated)</label>
                      <input
                        type="text"
                        name="mentorPreferences"
                        value={formData.mentorPreferences.join(', ')}
                        onChange={handleMentorPreferencesChange}
                        placeholder="e.g. IT, AI, Software Development"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
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
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
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
          )}

          {activeTab === 'mentors' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Find Mentors</h1>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search mentors by name or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <div className="relative">
                      <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Filter by skill"
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentors List */}
              {filteredMentors.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredMentors.map((mentor) => (
                    <div key={mentor._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={mentor.profilePicture || 'https://via.placeholder.com/150'}
                            alt={mentor.user.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{mentor.user.name}</h3>
                            <p className="text-gray-600 flex items-center">
                              <Briefcase className="h-4 w-4 mr-2" />
                              {mentor.currentCompany}
                            </p>
                            <p className="text-gray-600">{mentor.industry} • {mentor.graduationYear}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {mentor.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {skill}
                                </span>
                              ))}
                              {mentor.skills.length > 3 && (
                                <span className="text-xs text-gray-500">+{mentor.skills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>Connect</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'network' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">My Network</h1>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Network Feature Coming Soon</h3>
                <p className="text-gray-600">You'll be able to view and manage your connections here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (profile?.verificationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
          <div className="mb-6">
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Rejected</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Your profile has been rejected by your institution. Please contact them for more information.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <GraduationCap className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Student Profile Setup</h1>
            <p className="text-gray-600 mt-2">Complete your profile to join the student network</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Year</label>
                <input
                  type="number"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  min="1900"
                  max="2100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  placeholder="e.g. Python, AI, Machine Learning"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interests (comma-separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests.join(', ')}
                  onChange={handleInterestsChange}
                  placeholder="e.g. Data Science, Cloud Computing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mentor Preferences (comma-separated)</label>
                <input
                  type="text"
                  name="mentorPreferences"
                  value={formData.mentorPreferences.join(', ')}
                  onChange={handleMentorPreferencesChange}
                  placeholder="e.g. IT, AI, Software Development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;