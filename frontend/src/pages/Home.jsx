import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import About from "../components/About";
import Faqs from "../components/Faqs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Faqs />
      <Footer />
    </div>
  );
}