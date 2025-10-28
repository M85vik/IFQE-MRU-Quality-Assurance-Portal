import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const leaders = [
  {
    name: 'Dr. Prashant Bhalla',
    title: 'Chancellor, MRU',
    message: "The IFQE framework represents a significant leap forward in our relentless pursuit of academic excellence. It institutionalizes our commitment to quality and ensures that every stakeholder is an active participant in our journey of continuous improvement.",
    imageUrl: '/portraits/Dr. Prashant Bhalla.webp',
  },
  {
    name: 'Prof. (Dr.) Deependra Kumar Jha',
    title: 'Vice-Chancellor, MRU',
    message: "This initiative is a cornerstone of the MRU 2.0 evolution. By establishing a comprehensive framework for quality enhancement, we are not only aligning with national and global standards but are also fostering a culture of accountability and innovation from the ground up.",
    imageUrl: '/portraits/Prof. (Dr.) Deependra Kumar Jha.png',
  },
  {
    name: 'Prof. (Dr.) Deepa Arora',
    title: 'Director, QAA',
    message: "The IFQE is more than a mechanism for evaluation; it's a testament to our university's allegiance to quality. This structured, dual-approach model empowers us to make data-informed decisions while valuing the rich academic experiences across our institution.",
    imageUrl: '/portraits/Dr.Deepa.webp',
  },
];

const accentGradients = [
  "from-blue-200 via-blue-50 to-pink-100",
  "from-green-100 via-lime-50 to-yellow-100",
  "from-fuchsia-100 via-rose-50 to-pink-100"
];

const LeadershipSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLeader = leaders[activeIndex];

  return (
    <section className="relative px-4 py-20 md:py-28 bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-50">
      
      {/* Section heading with a color accent */}
      <div className="text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-900"
        >
          Our <span className="text-pink-600">Leadership</span> & Governance
        </motion.h2>
        <div className="mx-auto my-4 w-20 h-1 rounded-full bg-gradient-to-r from-blue-600 to-pink-400" />
        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          Visionaries behind MRU’s transformation and the IFQE journey.
        </p>
      </div>
      
      {/* Main leadership card with pastel gradient accent */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-stretch relative z-10">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`flex-1 flex flex-col justify-center relative shadow-2xl rounded-2xl p-10 min-h-[300px] bg-gradient-to-r ${accentGradients[activeIndex % accentGradients.length]} border-2 border-blue-200`}
        >
          <Quote className="mb-3 text-pink-500 w-10 h-10" />
          <p className="text-xl italic text-blue-900 mb-6 font-semibold leading-relaxed">{`"${activeLeader.message}"`}</p>
          <div className="flex items-center gap-4 mt-auto">
            <img
              src={activeLeader.imageUrl}
              alt={activeLeader.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-pink-300 shadow-lg"
            />
            <div>
              <div className="font-semibold text-blue-900">{activeLeader.name}</div>
              <div className="text-sm text-gray-600">{activeLeader.title}</div>
            </div>
          </div>
        </motion.div>

        {/* Vertical leader navigation */}
        <div className="w-full md:w-64 flex md:flex-col gap-3 md:gap-4 justify-center items-center">
          <span className="font-semibold text-gray-500 text-sm mb-2">Meet Our Leaders</span>
          {leaders.map((leader, idx) => (
            <button
              key={leader.name}
              onClick={() => setActiveIndex(idx)}
              className={`group w-56 flex items-center py-2 px-4 rounded-lg cursor-pointer transition-all border-2 ${
                idx === activeIndex
                  ? "bg-pink-100 border-pink-400 shadow-lg scale-105 text-pink-700"
                  : "bg-white border-blue-100 text-gray-700 hover:bg-blue-50"
              }`}
            >
              <img
                src={leader.imageUrl}
                alt={leader.name}
                className={`w-10 h-10 rounded-full border-2 mr-4 ${
                  idx === activeIndex ? "border-pink-400" : "border-blue-200"
                }`}
              />
              <div>
                <div className="font-bold">{leader.name}</div>
                <div className="text-xs text-gray-500">{leader.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Decorative pastel blob overlays for added color touch */}
      <div className="absolute -top-24 -left-40 w-96 h-72 bg-pink-100 rounded-full blur-2xl opacity-30 z-0"/>
      <div className="absolute bottom-0 right-0 w-96 h-56 bg-blue-200 rounded-full blur-3xl opacity-20 z-0"/>
    </section>
  );
};

export default LeadershipSection;
