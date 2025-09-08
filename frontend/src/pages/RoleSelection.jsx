import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Building2 } from "lucide-react"; // icons

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Explore career opportunities, connect with alumni, and grow your network.",
      icon: <GraduationCap className="w-12 h-12 text-indigo-600" />,
    },
    {
      id: "alumni",
      title: "Alumni",
      description: "Give back to your community, mentor students, and stay connected.",
      icon: <Users className="w-12 h-12 text-indigo-600" />,
    },
    {
      id: "institution",
      title: "Institution",
      description: "Manage alumni, track progress, and strengthen community engagement.",
      icon: <Building2 className="w-12 h-12 text-indigo-600" />,
    },
  ];

  const handleSelect = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Choose Your Role
        </h1>
        <p className="text-gray-600 mb-10">
          Select how you want to join our platform
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleSelect(role.id)}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  {role.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {role.title}
                </h2>
                <p className="text-gray-600 text-sm">{role.description}</p>
                <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                  Continue as {role.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;