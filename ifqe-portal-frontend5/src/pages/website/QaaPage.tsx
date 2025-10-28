import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import {
  CheckCircle, ClipboardList, BarChart2, Users, Globe, Award, Settings,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QaaPage = () => {
  return (
    <WebsiteLayout>
      <main className="bg-gradient-to-tr from-blue-50 to-white min-h-screen py-16 px-6 md:px-20 lg:px-40 space-y-16">

        {/* Hero section: Intro */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <ClipboardList className="inline-block text-blue-700 mb-4" size={56} />
          <h1 className="text-5xl font-extrabold text-blue-900 mb-2">
            Quality Assurance & Accreditation (QAA) Office
          </h1>
          <span className="block w-20 h-1 bg-red-600 rounded-full mx-auto mb-6"></span>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-800 leading-relaxed">
            Quality in higher education is the cornerstone of academic excellence, institutional credibility, and societal development.
            At Manav Rachna University, the QAA office institutionalizes a structured, strategic approach to quality assurance,
            continuous improvement, and stakeholder engagement aligned with the highest national and international standards.
          </p>
        </motion.section>

        {/* Core Functions */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <article className="bg-white rounded-xl p-8 shadow-lg border-t-8 border-blue-600 hover:shadow-xl transition cursor-default flex flex-col items-center text-center">
            <BarChart2 size={48} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-800">
              Strategic Planning & Monitoring
            </h3>
            <p className="text-gray-700">
              The QAA office ensures data-driven, continuous quality planning and rigorous monitoring across all academic and administrative units.
            </p>
          </article>

          <article className="bg-white rounded-xl p-8 shadow-lg border-t-8 border-red-600 hover:shadow-xl transition cursor-default flex flex-col items-center text-center">
            <Users size={48} className="text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              Stakeholder Engagement
            </h3>
            <p className="text-gray-700">
              Facilitating inclusion of students, faculty, staff, and external experts to embed quality consciousness in all university activities.
            </p>
          </article>

          <article className="bg-white rounded-xl p-8 shadow-lg border-t-8 border-green-600 hover:shadow-xl transition cursor-default flex flex-col items-center text-center">
            <Award size={48} className="text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Accreditation & Compliance
            </h3>
            <p className="text-gray-700">
              Managing all accreditation processes, documentation, and continuous adherence to national and international academic standards.
            </p>
          </article>
        </motion.section>

        {/* Implementation Areas */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl p-12 shadow-xl text-gray-800"
        >
          <h2 className="text-4xl font-bold mb-8 text-blue-900 text-center">
            Key Operational Domains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-blue-700" size={28} />
                <h3 className="text-xl font-semibold text-blue-800">Academic Excellence Monitoring</h3>
              </div>
              <p>
                Systematic evaluation of curriculum relevance, teaching quality, learning outcomes, and faculty performance to ensure academic standards remain exemplary.
              </p>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-red-600" size={28} />
                <h3 className="text-xl font-semibold text-red-700">Infrastructure & Resource Audit</h3>
              </div>
              <p>
                Continuous assessment of physical and digital infrastructure to support quality teaching, research, and student welfare.
              </p>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-700" size={28} />
                <h3 className="text-xl font-semibold text-green-700">Feedback & Quality Culture</h3>
              </div>
              <p>
                Establishing a culture of quality consciousness through feedback collection and active stakeholder participation.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-yellow-500" size={28} />
                <h3 className="text-xl font-semibold text-yellow-600">Research & Innovation Tracking</h3>
              </div>
              <p>
                Monitoring research outputs, patents, projects, and innovation outcomes to foster an environment conducive to knowledge creation and application.
              </p>

              <div className="flex items-center gap-3">
                <Globe size={28} className="text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-700">International Collaborations</h3>
              </div>
              <p>
                Supporting and embedding global partnerships and exchanges as part of broader quality goals and benchmarking.
              </p>

              <div className="flex items-center gap-3">
                <Settings size={28} className="text-teal-600" />
                <h3 className="text-xl font-semibold text-teal-700">Continuous Improvement Metrics</h3>
              </div>
              <p>
                Use of data analytics and KPIs to track institutional progress and implement timely corrective actions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Impact and Vision */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-6">Our Commitment to Excellence</h2>
          <p className="text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto mb-8">
            The Office of Quality Assurance and Accreditation at MRU embodies a strategic vision of sustained academic excellence and institutional integrity.
            Through meticulous monitoring, rigorous accreditation processes, and a vibrant stakeholder culture, the QAA ensures MRU remains at the forefront of higher education innovation and impact.
          </p>
          <img
            src="https://manavrachna.edu.in/assets/campus/mru/images/diversity-banner.webp"
            alt="MRU Campus Quality Assurance"
            className="mx-auto rounded-2xl shadow-lg max-w-xl ring-4 ring-blue-300"
          />
        </motion.section>

      </main>
    </WebsiteLayout>
  );
};

export default QaaPage;
