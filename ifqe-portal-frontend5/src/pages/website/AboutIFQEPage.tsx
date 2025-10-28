import React from 'react';
import {
  University, Star, BarChart2, User, FileText, Globe, ClipboardList,
  Users, BadgeCheck, Lightbulb, TrendingUp, Award, Calendar, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import WebsiteLayout from '../../components/layout/WebsiteLayout';

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

export default function IFQEPage() {
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
          <img
            src="https://manavrachna.edu.in/assets/campus/mru/images/overview-banner-mid1.webp"
            alt="Campus"
            className="rounded-2xl mt-6 shadow-xl mx-auto w-full max-w-3xl ring-2 ring-blue-400"
          />
        </motion.section>

        {/* Executive Summary with Animation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeX}
          transition={{ duration: 0.7 }}
          className="rounded-xl bg-white bg-opacity-80 border-l-8 border-blue-500 shadow-xl max-w-4xl mx-auto p-10 space-y-3"
        >
          <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <FileText className="text-blue-500" /> Executive Summary
          </h2>
          <p className="text-gray-800 leading-relaxed">
            The IFQE at MRU is a dynamic quality enhancement system for academic and institutional excellence. By integrating global benchmarks (NAAC, NBA, NIRF, QS), IFQE empowers sustainable improvement, robust decision-making, and confidence in governance.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <BadgeCheck className="text-red-500" />
            <span>Vision & strategy aligned to MRU 2.0</span>
            <BadgeCheck className="text-blue-500" />
            <span>Qualitative and quantitative indicator tracking</span>
            <BadgeCheck className="text-red-500" />
            <span>Transparent rubrics, reviews and feedback</span>
          </div>
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

        {/* Strategic Projects Timeline Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeY}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row bg-white shadow rounded-2xl overflow-hidden mt-8"
        >
          <div className="w-full lg:w-2/3 p-10">
            <h2 className="text-3xl font-bold text-blue-700 mb-3 flex gap-2 items-center">
              <TrendingUp /> MRU 2.0 Strategic Projects
            </h2>
            <ol className="relative border-l-4 border-red-500 ml-4 space-y-7">
              {[
                { date: 'Jan 2024', text: 'Academic curriculum revamp & NEP 2020 alignment.' },
                { date: 'Mar 2024', text: 'Launch of Research Funding & Innovation Incubator.' },
                { date: 'Jun 2024', text: 'Comprehensive Faculty Training Weeks.' },
                { date: 'Aug 2024', text: 'MoUs: Industry/Academic Collaborations.' },
                { date: 'Oct 2024', text: 'Digital Transformation of Admin Processes.' }
              ].map((proj, i) => (
                <li key={i} className="mb-6 ml-4">
                  <div className="absolute -left-6 flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full border-4 border-blue-500 shadow">
                    <Calendar className="text-blue-600" />
                  </div>
                  <div className="pl-10">
                    <span className="font-bold text-blue-900">{proj.date}</span>
                    <p className="text-gray-800">{proj.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="w-full lg:w-1/3 bg-gradient-to-b from-blue-100 via-white to-red-100 flex items-center justify-center p-8">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/time-management-illustration-svg-download-png-6137897.png"
              alt="Quality Timeline"
              className="mx-auto rounded-xl shadow-lg w-full max-w-xs saturate-200 ring-2 ring-red-300"
            />
          </div>
        </motion.section>

        {/* Stakeholder Panels with Animation */}
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
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">Student Engagement</h3>
            <p className="mb-4 text-gray-700">
              Clubs, events, internships and alumni initiatives empower student growth and satisfaction.
            </p>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/047/784/019/small/an-illustration-of-online-learning-with-a-group-of-students-using-laptops-and-a-teacher-presenting-a-pie-chart-free-vector.jpg"
              alt="Students"
              className="rounded-lg shadow-lg object-cover h-40 w-full mb-4"
            />
            <span className="inline-block rounded-full px-4 py-1 bg-blue-100 text-blue-800 font-semibold text-sm">#LifeAtMRU</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.06 }} className="bg-white shadow-xl rounded-2xl p-8 border-t-8 border-red-500 flex flex-col items-center text-center">
            <Award className="mb-4 text-blue-600" size={48} />
            <h3 className="text-2xl font-semibold text-red-700 mb-2">Faculty Excellence</h3>
            <p className="mb-4 text-gray-700">
              Recognizing top-performing faculty for research, innovation, and teaching excellence.
            </p>
            <img
              src="https://faculty-excellence-tracker.vercel.app/assets/Hero_section_image-D-rn-ObN.jpg"
              alt="Faculty"
              className="rounded-lg shadow-lg object-cover h-40 w-full mb-4"
            />
            <span className="inline-block rounded-full px-4 py-1 bg-red-100 text-red-800 font-semibold text-sm">#FacultyFirst</span>
          </motion.div>
        </motion.section>

        {/* Criteria Grid with Illustrations and Animations */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeY}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto mt-14"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 flex justify-center items-center gap-2">
            <Settings /> Evaluation Criteria & Initiatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div whileHover={{ scale: 1.03 }} className="p-8 rounded-xl bg-blue-50 shadow-xl">
              <Lightbulb size={40} className="text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-blue-800">Curriculum & Pedagogy</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-5">
                <li>Outcome-based design</li>
                <li>Industry partnerships in curriculum</li>
                <li>Active learning strategies</li>
                <li>Innovative pedagogy workshops</li>
              </ul>
              <img src="https://img.freepik.com/premium-vector/creative-colorful-education-illustration-with-books-school-supplies_1300528-8860.jpg"
                alt="Education"
                className="w-24 mx-auto"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="p-8 rounded-xl bg-red-50 shadow-xl">
              <TrendingUp size={40} className="text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-red-800">Research & Innovation</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-5">
                <li>Patents and publications</li>
                <li>Innovation incubators</li>
                <li>Funded project showcases</li>
                <li>Hackathons & seminars</li>
              </ul>
              <img src="https://img.freepik.com/free-vector/flat-design-innovative-idea-concept_52683-76709.jpg"
                alt="Innovation"
                className="w-24 mx-auto"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="p-8 rounded-xl bg-blue-50 shadow-xl">
              <Globe size={40} className="text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2 text-blue-800">Global Collaboration</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-5">
                <li>International MoUs</li>
                <li>Student/faculty exchange</li>
                <li>Joint conferences</li>
                <li>Collaborative webinars</li>
              </ul>
              <img src="https://img.freepik.com/free-vector/tiny-business-persons-working-jigsaw-puzzle-together-metaphor-cooperation-partnership-collaboration-team-people-flat-vector-illustration-communication-teamwork-concept_74855-25328.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Collab"
                className="w-24 mx-auto"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Director, Contact & Animated CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeY}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto mt-10 rounded-lg p-10 text-center bg-gradient-to-b from-blue-100 to-white border-2 border-blue-500 shadow-xl flex flex-col items-center"
        >
          <User size={92} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl mb-1 font-bold text-blue-800">Prof. Dr. Deepa Arora</h2>
          <div className="font-medium text-gray-900 mb-3">Director, Quality Assurance & Accreditation</div>
          <p className="text-gray-700 max-w-2xl mx-auto mb-4">
            Leading a passionate team at QAA, Prof. Arora champions transparency, continuous academic improvement, and stakeholder engagement for MRU’s future.
            Your feedback and involvement shapes the journey!
          </p>
          <motion.a
            whileHover={{ scale: 1.06 }}
            href="mailto:qaa@mananrachna.edu.in"
            className="inline-block mt-3 bg-blue-700 px-8 py-3 rounded-md text-white font-bold text-lg shadow-md hover:bg-blue-900 transition focus:outline-none"
          >
            Contact QAA Office
          </motion.a>
        </motion.section>
      </main>
    </WebsiteLayout>
  );
}

