import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load your Spline 3D viewer for effect
const SplineViewer = React.lazy(() => import('../landing/SplineViewer'));

export default function HeroSection() {
  return (
    <section className="relative h-[100vh] min-h-[600px] flex items-center justify-center text-center bg-gradient-to-br from-blue-100 via-violet-50 to-pink-100 overflow-hidden">

      {/* Spline 3D Scene: Right Side */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Suspense fallback={null}>
          <SplineViewer />
        </Suspense>
      </div>


      {/* Decorative poster, visually balanced */}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tl from-blue-400/10 via-pink-400/5 to-white/0 pointer-events-none"></div>

      {/* Hero Content */}
      <motion.div
        className="z-20 relative px-8 sm:px-16 py-20 max-w-full  mx-auto backdrop-blur-lg mt-15 h-[80%]"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
      >
        <motion.h1
          className="text-7xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 drop-shadow mb-6 mt-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Institutional Framework for{' '}
          <span className="text-pink-600">Quality Enhancement</span>
        </motion.h1>

        <h2 className="text-5xl sm:text-3xl font-bold text-blue-700 mb-6">
          Redefining Academic Excellence
        </h2>
        <motion.p
          className="text-xl text-gray-700 font-medium mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Manav Rachna University’s Institutional Framework for Quality Enhancement—
          a unified, visual digital ecosystem for data-driven educational success.
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <Link
            to="/about-ifqe"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-tr from-pink-500 to-blue-500 text-white text-lg font-bold shadow-lg hover:scale-105 transition transform hover:from-blue-500 hover:to-pink-500"
          >
            Explore the Framework <ArrowRight size={22} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-600 border-2 border-blue-500 text-lg font-semibold shadow-md hover:bg-blue-50 transition"
          >
            Portal Login <LogIn size={20} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
