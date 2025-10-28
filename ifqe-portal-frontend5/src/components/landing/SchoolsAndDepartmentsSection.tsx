import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { University, X } from 'lucide-react';

const schoolsData = [
  {
    name: 'School of Engineering',
    videoSrc: '/school-of-engineering.mp4',
    departments: ['Computer Science', 'Mechanical Engineering'],
    color: "from-indigo-200 via-blue-50 to-cyan-100"
  },
  {
    name: 'School of Law',
    videoSrc: '/school-of-law.mp4',
    departments: ['Corporate Law'],
    color: "from-pink-200 via-fuchsia-50 to-orange-100"
  },
  {
    name: 'School of Management',
    videoSrc: '/school-of-management.mp4',
    departments: ['Business Administration', 'Commerce'],
    color: "from-emerald-100 via-lime-50 to-yellow-100"
  },
  {
    name: 'School of Sciences',
    videoSrc: '/school-of-sciences.mp4',
    departments: ['Physics'],
    color: "from-blue-100 via-cyan-50 to-green-100"
  },
  {
    name: 'School of Humanities',
    videoSrc: '/school-of-humanities.mp4',
    departments: ['Education', 'English'],
    color: "from-yellow-100 via-rose-50 to-pink-100"
  },
];

const SchoolsAndDepartmentsSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-blue-100 via-pink-50 to-yellow-50 min-h-[80vh]">
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2"
        >
          Our Academic <span className="text-pink-600">Landscape</span>
        </motion.h2>
        <div className="w-16 h-1 mx-auto my-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-400" />
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Explore MRU’s vibrant constellation of schools and departments.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto z-10">
        {schoolsData.map((school, idx) => (
          <motion.div
            key={school.name}
            whileHover={{ scale: 1.06, rotate: -2 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`rounded-3xl cursor-pointer shadow-xl transition-all bg-gradient-to-br ${school.color} px-7 py-6 flex flex-col items-center w-80 relative`}
            onClick={() => setSelectedIndex(idx)}
          >
            <span className="block mb-4 rounded-full shadow bg-white p-2">
              <University className="w-8 h-8 text-indigo-500" />
            </span>
            <h3 className="text-xl font-bold text-blue-900 mb-1 text-center drop-shadow">{school.name}</h3>
            <div className="h-1 w-14 bg-pink-300 rounded-full mx-auto mb-3" />
            <p className="text-gray-600 text-center text-sm mb-4">
              {school.departments.length} Department{school.departments.length > 1 ? 's' : ''}
            </p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <>
            {/* Overlay Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
            />
            {/* School Expanded Card */}
            <motion.div
              key={schoolsData[selectedIndex].name}
              className="fixed z-40 inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 40 }}
              transition={{ duration: 0.23 }}
            >
              <div className={`bg-gradient-to-br ${schoolsData[selectedIndex].color} min-w-[340px] w-full max-w-lg p-8 rounded-3xl shadow-2xl border-4 border-blue-200 relative flex flex-col items-center`}>
                <button
                  className="absolute top-6 right-6 p-2 bg-white/60 rounded-full shadow transition hover:bg-pink-200"
                  onClick={() => setSelectedIndex(null)}
                >
                  <X className="w-6 h-6 text-pink-600" />
                </button>
                <University className="w-14 h-14 text-blue-700 mb-3" />
                <h3 className="text-2xl font-bold text-blue-900 mb-2 text-center">{schoolsData[selectedIndex].name}</h3>
                <div className="h-1 w-16 bg-pink-300 rounded-full mx-auto mb-4"/>
                <span className="block font-bold text-lg text-blue-700 my-3">Departments:</span>
                <ul className="flex flex-col gap-1 text-base text-indigo-800 font-semibold">
                  {schoolsData[selectedIndex].departments.map(dept => (
                    <li key={dept} className="rounded bg-white/70 px-3 py-1 shadow border border-blue-100">{dept}</li>
                  ))}
                </ul>
                {/* Placeholder for video preview if needed */}
                {/* <video src={schoolsData[selectedIndex].videoSrc} className="mt-4 rounded-xl shadow-xl" controls /> */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Pastel Blob Decorations */}
      <div className="absolute -top-32 left-0 w-72 h-72 bg-pink-100 rounded-full blur-2xl opacity-30 z-0"/>
      <div className="absolute bottom-0 right-0 w-80 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 z-0"/>
    </section>
  );
};

export default SchoolsAndDepartmentsSection;
