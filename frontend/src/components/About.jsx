export default function About() {
  const features = [
    {
      icon: "🎓",
      title: "For Students",
      description: "Receive career guidance, mentorship, and valuable insights from experienced alumni in your field."
    },
    {
      icon: "👔",
      title: "For Alumni",
      description: "Stay connected with your alma mater and contribute to shaping the future careers of current students."
    },
    {
      icon: "🏛️",
      title: "For Institutions",
      description: "Maintain a centralized system to manage alumni data, track achievements, and strengthen community engagement."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are building a powerful network that connects students with their alumni, fostering mentorship, career growth, and lasting institutional connections.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100"
            >
              <div className="text-6xl mb-6 text-center">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
