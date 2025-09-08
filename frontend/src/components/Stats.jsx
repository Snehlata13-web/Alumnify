export default function Stats() {
  const data = [
    { number: "20K+", label: "Alumni", icon: "👥" },
    { number: "200+", label: "Institutes", icon: "🏫" },
    { number: "50K+", label: "Students", icon: "🎓" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Connecting students and alumni across institutions worldwide</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
                {item.number}
              </h3>
              <p className="text-gray-600 font-medium text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
