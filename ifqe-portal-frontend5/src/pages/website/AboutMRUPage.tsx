import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Award, Users, Lightbulb, TrendingUp, Globe, Library, Medal
} from 'lucide-react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';

const sectionFade = { hidden: { opacity: 0, y: 64 }, visible: { opacity: 1, y: 0 } };

export default function AboutMRUPage() {
  return (
    <WebsiteLayout>
      <main className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionFade}
          transition={{ duration: 0.8 }}
          className="py-20 text-center max-w-5xl mx-auto"
        >
          <GraduationCap size={60} className="mx-auto text-blue-700 mb-4" />
          <h1 className="text-5xl font-extrabold text-blue-900 mb-3">About Manav Rachna University</h1>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Manav Rachna University (MRU) stands as a beacon of academic excellence, innovation, and holistic development. With NAAC ‘A’ accreditation and global recognition, MRU blends rigorous academics, advanced research, and a vibrant campus culture to prepare students as ethical leaders and innovators.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <img src="campus.png"
              alt="MRU Campus"
              className="rounded-2xl shadow-xl w-full max-w-lg"
            />
          </div>
        </motion.section>

        {/* Pillars / Highlights Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl px-4 mx-auto">
            <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center">Our Transformative Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Award size={40} className="text-red-500" />,
                  title: 'Academic Excellence',
                  desc: 'NAAC A-accredited courses, AICTE & UGC recognition, and modern pedagogy for today’s learners.',
                },
                {
                  icon: <Lightbulb size={40} className="text-blue-600" />,
                  title: 'Innovation & Research',
                  desc: "Award-winning faculty and students, leading-edge research, and strong industry partnerships drive progress.",
                },
                {
                  icon: <Users size={40} className="text-green-500" />,
                  title: 'Community & Diversity',
                  desc: 'A vibrant, inclusive campus welcoming talent from across India and the globe.',
                },
                {
                  icon: <TrendingUp size={40} className="text-amber-500" />,
                  title: 'Holistic Development',
                  desc: 'Leadership, sports, culture, entrepreneurship, and social impact—all shape the MRU student journey.',
                },
              ].map((pillar, idx) => (
                <div key={idx} className="bg-blue-50 rounded-xl p-7 shadow flex flex-col items-center text-center hover:bg-blue-100 transition">
                  {pillar.icon}
                  <h3 className="text-lg font-bold mt-4 mb-2">{pillar.title}</h3>
                  <p className="text-gray-700 text-sm">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Accreditations & Awards */}
        <motion.section
          className="max-w-7xl mx-auto py-16 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
            Recognitions and Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white shadow ring-1 ring-blue-100 rounded-xl p-7 flex flex-col items-center">
              <Medal size={48} className="text-red-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Leading State Private University</h3>
              <ul className="list-disc list-inside text-gray-700 text-left space-y-1">
                <li>Established under Haryana State Legislature Act 26, 2014.</li>
                <li>NAAC ‘A’ grade; Times Engineering Survey #1 in Research Capability.</li>
                <li>UGC, AICTE, NIRF recognized, NBA-accredited programs.</li>
                <li>Global alliances (Indian Global Higher Education Alliance, AWS Academy).</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-7 shadow flex flex-col items-center">
              <Globe size={48} className="text-blue-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">Research & Global Impact</h3>
              <ul className="list-disc list-inside text-gray-700 text-left space-y-1">
                <li>600+ Scopus-indexed publications.</li>
                <li>Strong research grants and innovation projects spanning sustainability, digital technologies, agriculture, and society.</li>
                <li>International collaborations and faculty/student exchanges.</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </main>
    </WebsiteLayout>
  );
}

