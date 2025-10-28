import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to IFQE Portal</h1>
      <p className="mb-6">A platform for managing quality assurance and submissions.</p>
      <div className="flex gap-4">
        <Link to="/about" className="text-blue-600 underline">About Us</Link>
        <Link to="/contact" className="text-blue-600 underline">Contact Us</Link>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
      </div>
    </div>
  );
}

// import '../../App.css'
// import Navbar from './Components/Navbar.tsx'
// import HeroSection from './Components/Hero.tsx'
// //import StatsSection from './Components/StatsSection.tsx'
// import AboutSection from './Components/AboutSection.tsx'
// import CriteriaSection from './Components/CriteriaSection.tsx'
// import FrameworkSection from './Components/FrameworkSection.tsx'
// import ResourcesSection from './Components/ResourcesSection.tsx'
// import HowItWorks from './Components/Working.tsx'
// import Footer from './Components/Footer.tsx'
// import BubbleBackground from './Components/BubbleBackground.tsx' // <-- IMPORT THE NEW COMPONENT

// function App() {
//   return (
//     <div className="relative z-0">
//       <Navbar />
//       <main className="relative z-10 bg-transparent">
//         <HeroSection />
//         {/* Bubble background for sections after Hero */}
//         <div className="relative">
//           <BubbleBackground />
//           <div className="relative z-10">
//             {/*<StatsSection/>*/}
//             <AboutSection />
//             <CriteriaSection />
//             <FrameworkSection />
//             <ResourcesSection />
//             <HowItWorks />
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default App