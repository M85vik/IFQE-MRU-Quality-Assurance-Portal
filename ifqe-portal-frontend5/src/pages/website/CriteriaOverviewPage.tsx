// src/pages/website/CriteriaOverviewPage.tsx

import React, { useState } from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, Award, Briefcase, Globe, ThumbsUp, ArrowRight, Eye, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';

// Data for the 7 criteria cards
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
      {/* Page Header */}
      <div className="bg-white text-center py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#083D77]">
          The 7 Core Assessment Criteria
        </h1>
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
                className={`bg-white rounded-lg shadow-lg h-full flex flex-col p-8 border-t-4 ${item.color} transform hover:-translate-y-2 transition-transform duration-300 group`}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-between items-start">
                  <div className="bg-blue-100 text-blue-700 p-3 rounded-full">
                    {React.cloneElement(item.icon, { size: 28 })}
                  </div>
                  <span className="font-bold text-lg text-gray-800 bg-gray-100 px-3 py-1 rounded-full">{item.weightage}</span>
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