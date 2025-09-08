export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Connect with Your <span className="text-blue-600">Alumni Network</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Build meaningful connections, gain mentorship, and advance your career 
            through our powerful alumni platform. From <span className="font-semibold">campus to career</span>, 
            guidance that lasts a lifetime.
          </p>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative">
          <img
            src="/image.png" // apni illustration yahan use karo
            alt="Alumni Illustration"
            className="w-full max-w-md mx-auto drop-shadow-lg"
          />
          {/* Decorative element */}
          <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        </div>
      </div>
    </section>
  );
}
