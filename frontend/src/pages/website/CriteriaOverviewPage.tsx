// src/pages/website/CriteriaOverviewPage.tsx

import React, { useState } from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, Award, Briefcase, Globe, ThumbsUp, ArrowRight, Eye, CheckCircle, University, Star, BarChart2, User, FileText, ClipboardList, BadgeCheck, Lightbulb, Calendar, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';

const fadeY = {
  hidden: { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0 }
};
const fadeX = {
  hidden: { opacity: 0, x: -70 },
  visible: { opacity: 1, x: 0 }
};
const fadeXR = {
  hidden: { opacity: 0, x: 70 },
  visible: { opacity: 1, x: 0 }
};

// 7 criteria cards data
const criteriaData = [
  {
    slug: 'academic-excellence-pedagogy',
    number: 1,
    title: 'Academic Excellence & Pedagogy',
    description: 'Ensuring a dynamic, value-driven curriculum and embracing effective teaching methods.',
    weightage: '25%',
    icon: <BookOpen />,
    color: 'border-green-500',
    subCriteria: ['Curriculum Design', 'Pedagogical Innovation', 'Digitization', 'Continuous Assessment', 'Performance Analysis', 'Attainment of Course Outcomes'],
  },
  {
    slug: 'research-innovation-impact',
    number: 2,
    title: 'Research, Innovation & Impact',
    description: 'Fostering a vibrant culture of research, innovation, and high-quality publications.',
    weightage: '25%',
    icon: <TrendingUp />,
    color: 'border-blue-500',
    subCriteria: ['Research Publications', 'Patents', 'Research Grants/Projects', 'Consultancy and MDPs', 'Start-ups', 'Research Infrastructure', 'Interdisciplinary Research', 'Ph.D. Program'],
  },
  {
    slug: 'student-lifecycle-engagement',
    number: 3,
    title: 'Student Lifecycle & Engagement',
    description: 'Cultivating an inclusive, student-centric environment from admission to alumni engagement.',
    weightage: '20%',
    icon: <Users />,
    color: 'border-teal-500',
    subCriteria: ['Admission', 'Induction Program', 'Mentor-Mentee System', 'Training & Workshops', 'Student Clubs', 'Industry Interaction', 'Placements & Progression', 'Internships', 'Student & Alumni Contribution'],
  },
  {
    slug: 'faculty-development-diversity',
    number: 4,
    title: 'Faculty Development & Diversity',
    description: 'Strengthening academic excellence through faculty research, diversity, and professional development.',
    weightage: '10%',
    icon: <Award />,
    color: 'border-indigo-500',
    subCriteria: ['Faculty Strength & Quality', 'Faculty Contribution'],
  },
  {
    slug: 'institutional-governance-vision',
    number: 5,
    title: 'Institutional Governance & Strategic Vision',
    description: 'Emphasizing robust governance, strategic planning, and infrastructure development.',
    weightage: '5%',
    icon: <Briefcase />,
    color: 'border-yellow-500',
    subCriteria: ['Budget Utilization', 'Infrastructure Maintenance', 'Feedback Implementation', 'Laboratory Development', 'Accreditation & Ranking'],
  },
  {
    slug: 'global-engagement-collaborations',
    number: 6,
    title: 'Global Engagement & Collaborations',
    description: 'Evaluating international alliances, mobility programs, and global viewpoints in the curriculum.',
    weightage: '5%',
    icon: <Globe />,
    color: 'border-purple-500',
    subCriteria: ['MOU\'s', 'Exchange Programs', 'International Collaborations', 'Global Academic Platforms'],
  },
  {
    slug: 'stakeholder-insights-improvement',
    number: 7,
    title: 'Stakeholder Insights & Continuous Improvement',
    description: 'Utilizing the Net Promoter Score (NPS) framework to measure satisfaction and drive improvement.',
    weightage: '10%',
    icon: <ThumbsUp />,
    color: 'border-rose-500',
    subCriteria: ['Net Promoter Score (NPS) Analysis'],
  },
];

const CriteriaOverviewPage: React.FC = () => {
  const [selectedCriterion, setSelectedCriterion] = useState<(typeof criteriaData)[0] | null>(null);

  return (
    <WebsiteLayout>

      <main className="bg-gradient-to-tl from-blue-50 via-white to-red-50 min-h-screen py-16 px-3 md:px-14 lg:px-28 space-y-16">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          variants={fadeY}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto rounded-xl bg-gradient-to-br from-blue-200/60 to-white p-10 border-4 border-red-500 shadow-xl space-y-4"
        >
          <University className="mx-auto text-blue-700" size={56} />
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-900 drop-shadow-xl">IFQE Portal</h1>
          <span className="inline-block h-1 w-20 bg-red-600 my-2 rounded-full"></span>
          <blockquote className="text-xl italic text-gray-700 font-medium">
            “What we build within becomes the foundation of what the world acknowledges.”
          </blockquote>
        </motion.section>

        {/* Executive Summary with Animation */}
        <motion.section
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          variants={fadeX}
          transition={{ duration: 0.7 }}
          className="rounded-xl bg-white bg-opacity-80 border-l-8 border-blue-500 shadow-xl max-w-4xl mx-auto p-10 space-y-3"
        >
          <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <FileText className="text-blue-500" /> Overview
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            Manav Rachna University (MRU), under the visionary leadership of Hon’ble Vice Chancellor,
            Prof. (Dr.) Deependra Kumar Jha, has established a comprehensive Institutional Framework
            for Quality Enhancement (IFQE) that drives continuous academic and institutional
            excellence. This framework, aligned with national standards and inspired by global best
            practices, aims to elevate teaching quality, research outcomes, and overall academic
            development.
          </p>
          <p className="text-gray-800 leading-relaxed text-justify">
            At the core of MRU’s quality ecosystem lies the Office of Quality Assurance & Accreditation
            (QAA), a strategic unit dedicated to planning, monitoring, and systematically enhancing
            academic standards. In pursuit of deeper and more structured quality assurance, MRU has
            introduced the Institutional Framework for Quality Enhancement (IFQE). It is a structured,
            two-pronged model encompassing qualitative and quantitative indicators that collectively
            support data-informed and experience-driven decision-making.
          </p>
        </motion.section>

        {/* Key Features Cards Row with Animation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeXR}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.article whileHover={{ scale: 1.04 }} className="rounded-xl bg-gradient-to-tr from-blue-100 to-white p-6 shadow-lg border-l-4 border-red-400 flex flex-col items-center text-center">
            <Star size={44} className="text-red-500 mb-3" />
            <h3 className="text-2xl font-bold mb-1 text-blue-900">Continuous Excellence</h3>
            <div className="h-1 w-10 bg-blue-500 rounded-full mb-2"></div>
            <p className="text-gray-700">
              Forward-thinking evaluation, participatory feedback, and innovation drive excellence university-wide.
            </p>
          </motion.article>
          <motion.article whileHover={{ scale: 1.04 }} className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-red-100 p-6 shadow-lg border-l-4 border-blue-400 flex flex-col items-center text-center">
            <BarChart2 size={44} className="text-blue-500 mb-3" />
            <h3 className="text-2xl font-bold mb-1 text-red-700">Balanced Assessment</h3>
            <div className="h-1 w-10 bg-red-400 rounded-full mb-2"></div>
            <p className="text-gray-700">
              Multi-dimensional rubrics blend data and experience across all departments for fair performance assessment.
            </p>
          </motion.article>
          <motion.article whileHover={{ scale: 1.04 }} className="rounded-xl bg-gradient-to-tr from-red-100 via-white to-blue-100 p-6 shadow-lg border-l-4 border-blue-600 flex flex-col items-center text-center">
            <ClipboardList size={44} className="text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold mb-1 text-blue-900">Quality Culture</h3>
            <div className="h-1 w-10 bg-blue-500 rounded-full mb-2"></div>
            <p className="text-gray-700">
              Every action is benchmarked, documented, and improved using our custom evaluation framework.
            </p>
          </motion.article>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeY}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <motion.div whileHover={{ scale: 1.06 }} className="bg-white shadow-xl rounded-2xl p-8 border-t-8 border-blue-500 flex flex-col items-center text-center">
            <Users className="mb-4 text-red-600" size={48} />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">Part A: Qualitative Assessment</h3>
            <p className="mb-4 text-gray-700 text-justify">
              Part A of the Institutional Framework for Quality Enhancement (IFQE) provides an
              Executive Summary from each school, highlighting its profile, vision and mission, and their
              alignment with MRU’s institutional goals. It includes a SWOC analysis, outlines strategic
              plans, and presents best practices, especially those aligned with the UN Sustainable
              Development Goals (SDGs). This section captures the school’s commitment to quality,
              sustainability, and continuous improvement through structured, goal-driven initiatives.
            </p>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/047/784/019/small/an-illustration-of-online-learning-with-a-group-of-students-using-laptops-and-a-teacher-presenting-a-pie-chart-free-vector.jpg"
              alt="Students"
              className="rounded-lg shadow-lg object-cover h-40 w-full mb-4"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.06 }} className="bg-white shadow-xl rounded-2xl p-8 border-t-8 border-red-500 flex flex-col items-center text-center">
            <Award className="mb-4 text-blue-600" size={48} />
            <h3 className="text-2xl font-semibold text-red-700 mb-2">Part B: Quantitative Assessment</h3>
            <p className="mb-4 text-gray-700 text-justify">
              Part B encompasses a thoughtfully structured set of indicators that offer a
              multidimensional assessment of institutional performance. These metrics go beyond
              conventional benchmarks to capture the essence of academic quality, research
              productivity, and faculty effectiveness, while also reflecting the depth of student
              engagement, perception, and the institution’s commitment to good governance and a
              global academic outlook.
            </p>
            <img
              src="https://faculty-excellence-tracker.vercel.app/assets/Hero_section_image-D-rn-ObN.jpg"
              alt="Faculty"
              className="rounded-lg shadow-lg object-cover h-40 w-full mb-4"
            />
          </motion.div>
        </motion.section>

      </main>
      {/* Page Header */}
      <div className="bg-white text-center py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#083D77] mb-6">
          Evaluation Criteria & Initiatives
        </h1>
        <h2 className='text-2xl md:text-3xl font-bold text-blue-500'>The 7 Core Assessment Criteria</h2>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
          The IFQE framework is built on seven pillars, each measuring key dimensions of institutional growth, governance, and academic performance.
        </p>
      </div>

      {/* Criteria Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {criteriaData.map((item, index) => (
              <motion.div
                key={index}
                className={`
    bg-gradient-to-br
    ${item.color === 'border-green-500' ? 'from-green-50 to-white' : ''}
    ${item.color === 'border-blue-500' ? 'from-blue-50 to-white' : ''}
    ${item.color === 'border-teal-500' ? 'from-teal-50 to-white' : ''}
    ${item.color === 'border-indigo-500' ? 'from-indigo-50 to-white' : ''}
    ${item.color === 'border-yellow-500' ? 'from-yellow-50 to-white' : ''}
    ${item.color === 'border-purple-500' ? 'from-purple-50 to-white' : ''}
    ${item.color === 'border-rose-500' ? 'from-rose-50 to-white' : ''}
    rounded-lg shadow-lg h-full flex flex-col p-8 border-t-4 ${item.color}
    transform hover:-translate-y-2 transition-transform duration-300 group whileHover:scale-1.03
  `}
              >

                <div className="flex justify-between items-start">
                  <div className={`bg-${item.color.split('-')[1]}-100 text-${item.color.split('-')[1]}-700 p-3 rounded-full`}>
                    {React.cloneElement(item.icon, { size: 28 })}
                  </div>
                  <span className="font-bold text-lg text-gray-800 bg-gray-100 px-3 py-1 rounded-full">{item.weightage}%</span>
                </div>
                <div className="flex-grow mt-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Criterion {item.number}: {item.title}
                  </h3>
                  <p className="mt-3 text-gray-600 h-20">{item.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Link to={`/criteria/${item.slug}`} className="font-semibold text-blue-600 flex items-center group-hover:underline">
                    Learn More <ArrowRight size={16} className="ml-2" />
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCriterion(item)}>
                    <Eye size={16} className="mr-2" /> Quick View
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Quick View */}
      {selectedCriterion && (
        <Modal
          isOpen={!!selectedCriterion}
          onClose={() => setSelectedCriterion(null)}
          title={`Criterion ${selectedCriterion.number}: ${selectedCriterion.title}`}
        >
          <p className="text-gray-600 mb-6">{selectedCriterion.description}</p>
          <h4 className="font-bold text-lg mb-3">Key Sub-Criteria:</h4>
          <div className="space-y-2">
            {selectedCriterion.subCriteria.map(sc => (
              <div key={sc} className="flex items-center bg-gray-50 p-3 rounded-md">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{sc}</span>
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <Button onClick={() => setSelectedCriterion(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </WebsiteLayout>
  );
};

export default CriteriaOverviewPage;