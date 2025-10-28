// src/pages/website/CriterionDetailPage.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { BookOpen, TrendingUp, Users, Award, Briefcase, Globe, ThumbsUp, ArrowLeft, CheckCircle } from 'lucide-react';

const criteriaDetails = {
  'academic-excellence-pedagogy': {
    number: 1,
    title: 'Academic Excellence & Pedagogy',
    description: 'This criterion demonstrates the commitment of each School towards academic excellence through a dynamic, value-driven curriculum and effective teaching methods. It assesses alignment with the University\'s mission, UN SDGs, and global academic standards, as well as the integration of digital tools and structured assessment methods.',
    icon: <BookOpen />,
    subCriteria: [
      { code: '1.1', title: 'Curriculum Design' },
      { code: '1.2', title: 'Pedagogical Innovation' },
      { code: '1.3', title: 'Digitization' },
      { code: '1.4', title: 'Continuous Assessment Methodology' },
      { code: '1.5', title: 'Performance and Evaluation Analysis' },
      { code: '1.6', title: 'Attainment of Course Outcomes' },
    ],
  },
  'research-innovation-impact': {
    number: 2,
    title: 'Research, Innovation & Impact',
    description: 'This criterion explores how each school fosters a vibrant culture of research and innovation. It evaluates the commitment to high-quality publications, patents, interdisciplinary projects, and faculty-led research proposals to government and non-government funding agencies.',
    icon: <TrendingUp />,
    subCriteria: [
      { code: '2.1', title: 'Research Publications' },
      { code: '2.2', title: 'Patents' },
      { code: '2.3', title: 'Research Grants/Projects' },
      { code: '2.4', title: 'Consultancy and MDPs' },
      { code: '2.5', title: 'Start-ups' },
      { code: '2.6', title: 'Research Infrastructure' },
      { code: '2.7', title: 'Interdisciplinary Research' },
      { code: '2.8', title: 'Ph.D. Program' },
    ],
  },
  'student-lifecycle-engagement': {
    number: 3,
    title: 'Student Lifecycle & Engagement',
    description: 'This criterion emphasizes the school\'s responsibility to cultivate a vibrant, inclusive, and student-centric environment that supports learners across all stages, from admission to alumni engagement. It covers academic, emotional, and infrastructural needs of a diverse student body.',
    icon: <Users />,
    subCriteria: [
      { code: '3.1', title: 'Admission' },
      { code: '3.2', title: 'Induction Program for Students' },
      { code: '3.3', title: 'Implementation of Mentor-Mentee System' },
      { code: '3.4', title: 'Training, Workshops, & Seminars' },
      { code: '3.5', title: 'Student Clubs' },
      { code: '3.6', title: 'Industry Interaction' },
      { code: '3.7', title: 'Placements & Progression' },
      { code: '3.8', title: 'Internships' },
      { code: '3.9', title: 'Student Contribution' },
      { code: '3.10', title: 'Alumni Contribution' },
    ],
  },
  'faculty-development-diversity': {
    number: 4,
    title: 'Faculty Development & Diversity',
    description: 'This criterion focuses on the foundational pillars that strengthen academic excellence. It evaluates the active recruitment of qualified faculty, promotion of a research-oriented culture with advanced degrees, and the fostering of gender diversity and inclusivity.',
    icon: <Award />,
    subCriteria: [
      { code: '4.1', title: 'Faculty Strength & Quality' },
      { code: '4.2', title: 'Faculty Contribution' },
    ],
  },
  'institutional-governance-vision': {
    number: 5,
    title: 'Institutional Governance & Strategic Vision',
    description: 'This criterion reflects the school\'s role in emphasizing robust governance, strategic planning, and infrastructure development as cornerstones of its academic mission. It includes budget planning, infrastructure maintenance, and continuous quality improvement.',
    icon: <Briefcase />,
    subCriteria: [
      { code: '5.1', title: 'Budget Utilization and Planning' },
      { code: '5.2', title: 'Infrastructure Maintenance and Ambience' },
      { code: '5.3', title: 'Infrastructure Feedback & Its Implementation' },
      { code: '5.4', title: 'New Laboratory Set Up & Purchase of New Equipments' },
      { code: '5.5', title: 'Departmental Library' },
      { code: '5.10', title: 'Accreditation/Ranking/Rating' },
    ],
  },
  'global-engagement-collaborations': {
    number: 6,
    title: 'Global Engagement & Collaborations',
    description: 'This criterion evaluates the quality and extent of the university\'s international engagement. It assesses strategic international alliances, faculty and student mobility programs, cooperative research projects, and the incorporation of global viewpoints into the curriculum.',
    icon: <Globe />,
    subCriteria: [
      { code: '6.1', title: 'MOU\'s (Memorandum of Understanding)' },
      { code: '6.2', title: 'Exchange Programs' },
      { code: '6.3', title: 'International Collaborations' },
      { code: '6.4', title: 'Engagement in Global Academic Platforms' },
      { code: '6.5', title: 'Seminars/Lectures by International Speakers' },
    ],
  },
  'stakeholder-insights-improvement': {
    number: 7,
    title: 'Stakeholder Insights & Continuous Improvement',
    description: 'This criterion utilizes the Net Promoter Score (NPS) framework as a strategic feedback mechanism to measure stakeholder satisfaction and drive improvement. It provides clear insight into areas of excellence and those requiring attention.',
    icon: <ThumbsUp />,
    subCriteria: [
      { code: '7.1', title: 'Net Promoter Score (NPS)' },
    ],
  },
};

const CriterionDetailPage: React.FC = () => {
  const { criterionId } = useParams<{ criterionId: string }>();
  const criterion = criterionId ? criteriaDetails[criterionId as keyof typeof criteriaDetails] : null;

  if (!criterion) {
    return (
      <WebsiteLayout>
        <div className="text-center py-40">
          <h1 className="text-3xl font-bold">Criterion Not Found</h1>
          <p className="mt-4">The page you are looking for does not exist.</p>
          <Link to="/criteria" className="mt-6 inline-block text-blue-600 hover:underline">
            &larr; Back to All Criteria
          </Link>
        </div>
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      {/* Page Header */}
      <div className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 text-blue-700 p-4 rounded-full">
              {React.cloneElement(criterion.icon, { size: 40 })}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#083D77] text-center">
            Criterion {criterion.number}: {criterion.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 text-center">
            {criterion.description}
          </p>
        </div>
      </div>

      {/* Sub-Criteria Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Key Sub-Criteria</h2>
          <div className="space-y-4">
            {criterion.subCriteria.map((sc, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <CheckCircle className="w-6 h-6 mr-4 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">{sc.code} - {sc.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/criteria"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to All Criteria
            </Link>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default CriterionDetailPage;