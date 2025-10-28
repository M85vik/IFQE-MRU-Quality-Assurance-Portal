import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import { Users, Award } from 'lucide-react';

// Placeholder or professional profile pictures can be added for each member
const committee = [
  {
    name: 'Dr. Deepa Arora',
    position: 'Professor and Director-QAA',
    department: 'Quality Assurance & Accreditation, MRU',
    imageUrl: '/portraits/Dr.Deepa.webp',
  },
  {
    name: 'Dr. Prashant Bhardwaj',
    position: 'Associate Professor',
    department: 'Department of Mechanical Engineering',
    imageUrl: '/portraits/Dr. Prashant Bhardwaj.png',
  },
  {
    name: 'Dr. Piyush Mahendru',
    position: 'Assistant Professor',
    department: 'Department of Mechanical Engineering',
    imageUrl: '/portraits/Dr. Piyush Mahendru.png',
  },
  {
    name: 'Dr. Smriti Mishra',
    position: 'Assistant Professor',
    department: 'Department of Mechanical Engineering',
    imageUrl: '/portraits/Dr. Smriti Mishra.png',
  },
  {
    name: 'Dr. Roopa Rani',
    position: 'Assistant Professor, Chemistry',
    department: 'Department of Sciences',
    imageUrl: '/portraits/Dr. Roopa Rani.png',
  },
  {
    name: 'Dr. Chandni Magoo',
    position: 'Associate Professor',
    department: 'Department of Computer Science & Technology',
    imageUrl: '/portraits/Ms.Chandini.webp',
  },
  {
    name: 'Dr. Arushi Malik',
    position: 'Assistant Professor',
    department: 'Department of Law',
    imageUrl: '/portraits/Dr. Arushi Malik.png',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function FacultyTeamPage() {
  return (
    <WebsiteLayout>
      <main className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-16 px-4 md:px-16 lg:px-32">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <Users className="mx-auto text-blue-700 mb-4" size={64} />
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">IFQE Committee Members</h1>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg max-w-2xl mx-auto text-gray-800 leading-relaxed">
            Meet the esteemed faculty and experts who guide the IFQE project. Their vision, leadership, and dedication drive the quality journey at Manav Rachna University.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ staggerChildren: 0.14 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {committee.map((member, idx) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              whileHover={{ scale: 1.06, rotate: -2 }}
              className="p-8 bg-white rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center transition-all cursor-pointer hover:shadow-2xl"
            >
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-28 h-28 mb-4 rounded-full object-cover shadow-xl border-4 border-blue-500"
                loading="lazy"
              />
              <h2 className="text-lg font-bold text-blue-800">{member.name}</h2>
              <p className="text-sm text-red-600 mt-1 font-semibold">{member.position}</p>
              <p className="text-xs text-gray-500">{member.department}</p>
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 font-semibold text-xs rounded-full px-2 py-1 mt-4">
                <Award size={14} /> IFQE Committee
              </span>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </WebsiteLayout>
  );
}
