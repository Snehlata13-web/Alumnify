import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Users,
  MessageCircle,
  Search,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  Star,
  TrendingUp,
  LogOut,
  Edit,
  CheckCircle,
  XCircle,
  Building,
  Mail,
  Hash,
  Globe,
  Image,
  Save,
  ArrowRight,
  Target,
  BookOpen
} from 'lucide-react';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '',
    graduationYear: '',
    currentCompany: '',
    department: '',
    industry: '',
    location: '',
    skills: [],
    availableForMentorship: false,
    availableForDonation: false,
    linkedin: '',
    profilePicture: 'https://via.placeholder.com/150'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.verificationStatus === 'verified') {
      fetchStudents();
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
          setIsPending(data.profile.verificationStatus === 'pending');
          setFormData({
            collegeName: data.profile.collegeName || '',
            graduationYear: data.profile.graduationYear || '',
            currentCompany: data.profile.currentCompany || '',
            department: data.profile.department || '',
            industry: data.profile.industry || '',
            location: data.profile.location || '',
            skills: data.profile.skills || [],
            availableForMentorship: data.profile.availableForMentorship || false,
            availableForDonation: data.profile.availableForDonation || false,
            linkedin: data.profile.linkedin || '',
            profilePicture: data.profile.profilePicture || 'https://via.placeholder.com/150'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/profile/alumni', {
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
        setIsPending(true);
        fetchProfile();
      } else {
        setMessage(data.message || 'Error updating profile');
      }
    } catch (error) {
      setMessage('Network error');
    }

    setLoading(false);
  };

  const filteredStudents = students.filter(student =>
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDepartment === '' || student.department.toLowerCase().includes(filterDepartment.toLowerCase()))
  );

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'network', label: 'My Network', icon: Users },
    { id: 'mentorship', label: 'Mentorship', icon: MessageCircle }
  ];

  if (profile?.verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <GraduationCap className="mx-auto h-12 w-12 text-yellow-600 mb-4" />
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
              <h2 className="text-xl font-bold text-gray-900">Alumni Hub</h2>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {profile.user?.name}!</h1>

              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.profilePicture || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{profile.user?.name}</h2>
                    <p className="text-gray-600 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {profile.currentCompany}
                    </p>
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
                    <p className="text-sm text-gray-500 mt-2">Class of {profile.graduationYear}</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Experience</p>
                      <p className="text-2xl font-bold text-gray-900">{new Date().getFullYear() - profile.graduationYear}y</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Skills</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.skills?.length || 0}</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Students Helped</p>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mentorship</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.availableForMentorship ? 'Active' : 'Inactive'}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('mentorship')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <MessageCircle className="h-6 w-6 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Mentorship</h4>
                    <p className="text-sm text-gray-600">Help students grow</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('network')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Users className="h-6 w-6 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Network</h4>
                    <p className="text-sm text-gray-600">Connect with peers</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Edit className="h-6 w-6 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Update Profile</h4>
                    <p className="text-sm text-gray-600">Keep your info current</p>
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
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          College Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleChange}
                            required
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter your college name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          Graduation Year
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            required
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="2020"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                          Department
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Computer Science"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                        Professional Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                          Current Company
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="currentCompany"
                            value={formData.currentCompany}
                            onChange={handleChange}
                            required
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Company Name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-gray-500" />
                          Industry
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            required
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Technology"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="City, State/Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          LinkedIn Profile
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Expertise Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-indigo-600" />
                        Skills & Expertise
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Award className="h-4 w-4 mr-2 text-gray-500" />
                        Skills (comma-separated)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills.join(', ')}
                          onChange={handleSkillsChange}
                          placeholder="e.g. JavaScript, React, Node.js, Python, Machine Learning"
                          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">List your technical skills, programming languages, and expertise areas</p>
                    </div>
                  </div>

                  {/* Media & Availability Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Image className="h-5 w-5 mr-2 text-indigo-600" />
                        Media & Availability
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
                            placeholder="https://example.com/your-photo.jpg"
                            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Availability Options</label>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input
                              id="mentorship"
                              name="availableForMentorship"
                              type="checkbox"
                              checked={formData.availableForMentorship}
                              onChange={handleChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="mentorship" className="ml-3 block text-sm text-gray-900 flex items-center">
                              <Users className="h-4 w-4 mr-2 text-blue-600" />
                              Available for Mentorship
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              id="donation"
                              name="availableForDonation"
                              type="checkbox"
                              checked={formData.availableForDonation}
                              onChange={handleChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="donation" className="ml-3 block text-sm text-gray-900 flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-600" />
                              Available for Donation
                            </label>
                          </div>
                        </div>
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

          {activeTab === 'network' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">My Network</h1>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Network Feature Coming Soon</h3>
                <p className="text-gray-600">Connect with fellow alumni and expand your professional network.</p>
              </div>
            </div>
          )}

          {activeTab === 'mentorship' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mentorship Program</h1>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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

              {/* Students List */}
              {filteredStudents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredStudents.map((student) => (
                    <div key={student._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={student.profilePicture || 'https://via.placeholder.com/150'}
                            alt={student.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-gray-600">{student.email}</p>
                            <p className="text-gray-600">Batch {student.batch} • {student.department}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {student.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {skill}
                                </span>
                              ))}
                              {student.skills.length > 3 && (
                                <span className="text-xs text-gray-500">+{student.skills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4" />
                            <span>Mentor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
            <h1 className="text-3xl font-bold text-gray-900">Alumni Profile Setup</h1>
            <p className="text-gray-600 mt-2">Complete your profile to join the alumni network</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

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
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    College Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your college name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    Graduation Year
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                    Department
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                  Professional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    Current Company
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-gray-500" />
                    Industry
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Technology"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Expertise Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-600" />
                  Skills & Expertise
                </h3>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-500" />
                  Skills (comma-separated)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    placeholder="e.g. JavaScript, React, Node.js, Python, Machine Learning"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">List your technical skills, programming languages, and expertise areas</p>
              </div>
            </div>

            {/* Media & Availability Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Image className="h-5 w-5 mr-2 text-indigo-600" />
                  Media & Availability
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
                      placeholder="https://example.com/your-photo.jpg"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Availability Options</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="mentorship"
                        name="availableForMentorship"
                        type="checkbox"
                        checked={formData.availableForMentorship}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="mentorship" className="ml-3 block text-sm text-gray-900 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        Available for Mentorship
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="donation"
                        name="availableForDonation"
                        type="checkbox"
                        checked={formData.availableForDonation}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="donation" className="ml-3 block text-sm text-gray-900 flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-600" />
                        Available for Donation
                      </label>
                    </div>
                  </div>
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Submit Profile</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;