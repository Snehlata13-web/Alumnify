import { useState } from "react";

const faqs = [
  {
    question: "What is Alumnify?",
    answer: "Alumnify is a comprehensive platform that connects students with their alumni network, providing mentorship opportunities, career guidance, and tools for institutions to manage alumni relations effectively.",
  },
  {
    question: "How do I join the platform?",
    answer: "You can register as a student, alumni, or institution representative through our secure registration process. Simply click the 'Register' button and follow the guided steps."
  },
  {
    question: "Is Alumnify free to use?",
    answer: "Yes, basic features are completely free for all users. We offer premium features for institutions and advanced networking tools that may require a subscription."
  },
  {
    question: "How can institutions benefit?",
    answer: "Institutions can track alumni achievements, organize events, manage donations, and maintain strong connections with their graduates through our centralized platform."
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Find answers to common questions about our platform</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                className="flex justify-between items-center w-full p-6 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg">{faq.question}</span>
                <span className="text-2xl text-blue-500 transform transition-transform duration-200" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
