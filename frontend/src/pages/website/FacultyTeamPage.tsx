import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import { Users, Award, Linkedin, Mail } from 'lucide-react';

// Placeholder or professional profile pictures can be added for each member
const committee = [
  {
    name: 'Dr. Deepa Arora',
    position: 'Professor and Director-QAA',
    department: 'Quality Assurance & Accreditation, MRU',
    linkedin: 'https://www.linkedin.com/in/dr-deepa-arora-4466881a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'iqac@mru.edu.in',
    imageUrl: '/portraits/Deepa-Arora.jpg',
  },
  {
    name: 'Dr. Prashant Bhardwaj',
    position: 'Associate Professor',
    department: 'Department of Mechanical Engineering',
    linkedin: 'https://www.linkedin.com/in/dr-prashant-bhardwaj-4b07a117b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'prashant@mru.edu.in',
    imageUrl: '/portraits/Dr. Prashant Bhardwaj.png',
  },
  {
    name: 'Dr. Chandni Magoo',
    position: 'Associate Professor',
    department: 'Department of Computer Science & Technology',
    linkedin: 'https://www.linkedin.com/in/dr-chandni-magoo-32a968255?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'chandnimagoo@mru.edu.in',
    imageUrl: '/portraits/Ms.Chandini.png',
  },
  {
    name: 'Dr. Roopa Rani',
    position: 'Assistant Professor, Chemistry',
    department: 'Department of Sciences',
    linkedin: 'https://www.linkedin.com/in/roopa-rani-451961272/',
    email: 'rooparani@mru.edu.in',
    imageUrl: '/portraits/Dr. Roopa Rani.png',
  },
  {
    name: 'Dr. Piyush Mahendru',
    position: 'Assistant Professor',
    department: 'Department of Mechanical Engineering',
    linkedin: 'https://www.linkedin.com/in/dr-piyush-mahendru-59424622?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    email: 'piyush@mru.edu.in',
    imageUrl: '/portraits/Dr. Piyush Mahendru.png',
  },
  {
    name: 'Dr. Smriti Mishra',
    position: 'Assistant Professor',
    department: 'Department of Mechanical Engineering',
    linkedin: 'https://www.linkedin.com/in/smriti25/',
    email: 'smritimishra@mru.edu.in',
    imageUrl: '/portraits/Dr. Smriti Mishra.png',
  },
  {
    name: 'Dr. Arushi Malik',
    position: 'Assistant Professor',
    department: 'Department of Law',
    linkedin: 'http://linkedin.com/in/dr-arushi-malik-mehta-a8280352',
    email: 'arushimmehta@mru.edu.in',
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
            Discover the esteemed faculty and experts steering the IFQE project. Their vision and dedication are actively propelling Manav Rachna University's journey toward educational distinction.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ staggerChildren: 0.14 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {committee.map((member, idx) => {
            const isLastCard = idx === committee.length - 1;
            const shouldCenter = isLastCard && committee.length % 3 === 1;
            return (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                whileHover={{ scale: 1.06, rotate: -2 }}
                className={`
          p-8 bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50
          rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center transition-all cursor-pointer hover:shadow-2xl
          ${shouldCenter ? 'md:col-start-2' : ''}
        `}
              >
                <img src={member.imageUrl} alt={member.name}
                  className="w-28 h-28 mb-4 rounded-full object-cover shadow-xl border-4 border-blue-500"
                  loading="lazy"
                />
                <h2 className="text-lg font-bold text-blue-800">{member.name}</h2>
                <p className="text-sm text-red-600 mt-1 font-semibold">{member.position}</p>
                <p className="text-xs text-gray-500">{member.department}</p>
                <div className="flex mt-4 gap-2">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="rounded-full p-2 bg-red-100 text-red-600 hover:bg-red-200 transition"
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                </div>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 font-semibold text-xs rounded-full px-2 py-1 mt-4">
                  <Award size={14} /> IFQE Committee
                </span>
              </motion.div>
            );
          })}
        </motion.section>

      </main>
    </WebsiteLayout>
  );
}
