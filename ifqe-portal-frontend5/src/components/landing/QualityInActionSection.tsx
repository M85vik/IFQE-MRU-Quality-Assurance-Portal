// src/components/landing/QualityInActionSection.tsx

import React, { useState, useEffect } from 'react';
import { motion, useInView, useAnimate, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileSearch, BarChart3, LayoutGrid, ClipboardList, BookOpen, FileText, CheckCircle, X } from 'lucide-react';

// --- Animated Counter Component ---
const Counter = ({ to }: { to: number }) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      animate(0, to, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (scope.current) {
            scope.current.textContent = Math.round(latest).toString();
          }
        }
      });
    }
  }, [isInView, to, animate, scope]);

  return <span ref={scope}>0</span>;
};

// --- Data for this section ---
const workflowSteps = [
  { icon: <UploadCloud size={28} />, title: '1. Submit with Confidence', description: 'Departments use guided templates to build and submit comprehensive reports.' },
  { icon: <FileSearch size={28} />, title: '2. Review with Clarity', description: 'The QAA team reviews submissions in a centralized, consistent environment.' },
  { icon: <BarChart3 size={28} />, title: '3. Analyze with Insight', description: 'Leadership gains powerful data visualizations to make informed strategic decisions.' }
];
const stats = [
  { value: 7, label: "Core Criteria", modalContent: 'criteria' },
  { value: 43, label: "Key Indicators", modalContent: 'keyIndicators' },
  { value: 125, label: "Performance Indicators", modalContent: 'performanceIndicators' },
  { value: 500, label: "Total Marks", modalContent: 'matrix' },
];
const resources = [
  { icon: <LayoutGrid size={24} />, title: 'Evaluation Matrix', modalContent: 'matrix' },
  { icon: <ClipboardList size={24} />, title: 'Assessment Rubrics', modalContent: 'rubrics' },
  { icon: <BookOpen size={24} />, title: 'Official Guidelines', modalContent: 'guidelines' },
  { icon: <FileText size={24} />, title: 'Standardized Templates', modalContent: 'templates' },
];

// --- Redesigned Modal Content Viewer ---
const ModalContentViewer = ({ content }: { content: string }) => {
  const renderContent = () => {
    switch (content) {
      case 'criteria': return (
        <div>
          <h3 className="font-bold text-xl mb-4 text-cyan-300">The 7 Core Criteria</h3>
          <p className="text-sm text-gray-400 mb-4">The framework is built on seven pillars that measure institutional performance.</p>
          <ul className="space-y-2 text-gray-300">
            {['Academic Excellence & Pedagogy', 'Research, Innovation & Impact', 'Student Lifecycle & Engagement', 'Faculty Development & Diversity', 'Institutional Governance & Strategic Vision', 'Global Engagement & Collaborations', 'Stakeholder Insights & Continuous Improvement'].map(item => (
              <li key={item} className="flex items-center"><CheckCircle size={16} className="text-green-400 mr-3 flex-shrink-0" /> {item}</li>
            ))}
          </ul>
        </div>
      );
      case 'matrix': return (
        <div className="overflow-x-auto">
          <h3 className="font-bold text-xl mb-4 text-cyan-300">IFQE Evaluation Matrix</h3>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-cyan-300/20 text-cyan-300">
              <tr>
                <th className="p-2">Criteria</th><th className="p-2">Key Indicators</th><th className="p-2">Perf. Indicators</th><th className="p-2">Marks</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-cyan-300/10 bg-white/5"><td className="p-2">Academic Excellence</td><td className="p-2">6</td><td className="p-2">21</td><td className="p-2">84</td></tr>
              <tr className="border-b border-cyan-300/10"><td className="p-2">Research & Impact</td><td className="p-2">8</td><td className="p-2">32</td><td className="p-2">128</td></tr>
              <tr className="border-b border-cyan-300/10 bg-white/5"><td className="p-2">Student Lifecycle</td><td className="p-2">10</td><td className="p-2">30</td><td className="p-2">120</td></tr>
              <tr className="border-b border-cyan-300/10"><td className="p-2">Faculty Development</td><td className="p-2">2</td><td className="p-2">16</td><td className="p-2">64</td></tr>
              <tr className="border-b border-cyan-300/10 bg-white/5"><td className="p-2">Governance & Vision</td><td className="p-2">11</td><td className="p-2">11</td><td className="p-2">44</td></tr>
              <tr className="border-b border-cyan-300/10"><td className="p-2">Global Engagement</td><td className="p-2">5</td><td className="p-2">12</td><td className="p-2">48</td></tr>
              <tr className="border-b border-cyan-300/10 bg-white/5"><td className="p-2">Stakeholder Insights</td><td className="p-2">1</td><td className="p-2">3</td><td className="p-2">12</td></tr>
              <tr className="font-bold bg-cyan-400/10 text-white"><td className="p-2">Total</td><td className="p-2">43</td><td className="p-2">125</td><td className="p-2">500</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">Source: IFQE Evaluation Matrix, Page 26</p>
        </div>
      );
      case 'rubrics': return (
        <div>
          <h3 className="font-bold text-xl mb-2 text-cyan-300">Assessment Rubrics</h3>
          <p className="text-gray-400">Each of the 125 Performance Indicators is evaluated against a detailed rubric with five levels of achievement, from "Not Satisfactory" (0 points) to "Excellent" (4 points), ensuring a consistent and transparent scoring process.</p>
        </div>
      );
      case 'guidelines': return (
        <div>
          <h3 className="font-bold text-xl mb-2 text-cyan-300">Official Guidelines</h3>
          <p className="text-gray-400">The IFQE document provides comprehensive guidelines for each indicator, including the required documents, formulas for calculation, and specific remarks to ensure submissions are accurate and complete.</p>
        </div>
      );
      case 'templates': return (
        <div>
          <h3 className="font-bold text-xl mb-2 text-cyan-300">Standardized Templates</h3>
          <p className="text-gray-400">To ensure uniformity, the IFQE provides official templates for data collection, such as the Curriculum Mapping template (1.1.1) and the Program Revision template (1.1.4). These are available for download within the portal.</p>
        </div>
      );
      default: return <div><h3 className="font-bold text-xl mb-2 text-cyan-300">{content}</h3><p className="text-gray-400">Detailed information for this topic will be displayed here.</p></div>;
    }
  };
  return <div className="font-mono">{renderContent()}</div>;
};

// --- "LED Screen" Style Modal ---
const LedModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        className="relative w-full max-w-2xl bg-black border-2 border-cyan-300/50 rounded-lg shadow-2xl shadow-cyan-500/20"
        onClick={(e) => e.stopPropagation()}
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        exit={{ clipPath: 'circle(0% at 50% 50%)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-300 font-mono tracking-widest">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Component ---
const QualityInActionSection: React.FC = () => {
  const [modalData, setModalData] = useState<{ title: string, content: string } | null>(null);

  return (
    <>
      <section className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center overflow-hidden p-4 py-24 relative">
        <div className="absolute inset-0 z-0 opacity-20" style={{
          backgroundImage: `
        radial-gradient(circle at 25% 30%, #3b82f6 0%, transparent 40%),
        radial-gradient(circle at 75% 70%, #ec4899 0%, transparent 40%)
      `
        }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="max-w-7xl mx-auto w-full z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-indigo-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Quality Enhancement in Action
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

            {/* Left side illustration */}
            <motion.div
              className="hidden lg:block lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="illustrations/workflow_illustration.png"
                alt="https://cdn.dribbble.com/userupload/23268325/file/original-f59247070f7b3e47d5293ecf3d398240.png?resize=752x&vertical=center"
                className="w-full h-auto"
              />
            </motion.div>

            {/* Right side content */}
            <div className="lg:col-span-3 space-y-8">

              <motion.h3 className="text-2xl font-bold mb-4 flex items-center text-teal-600">
                <CheckCircle className="mr-3 text-teal-600" /> The IFQE Workflow
              </motion.h3>

              <div className="space-y-3">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-start bg-white border border-gray-300 p-4 rounded-lg shadow-sm">
                    <div className="text-blue-500 p-2">{step.icon}</div>
                    <div className="ml-3">
                      <h4 className="font-bold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Impact Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center"><BarChart3 className="text-cyan-300 mr-3" /> Framework by the Numbers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <motion.div key={stat.label} className="bg-gray-800/50 p-4 rounded-lg shadow-lg border border-white/10 text-center cursor-pointer" whileHover={{ scale: 1.05, y: -5, borderColor: '#67E8F9' }} onClick={() => setModalData({ title: stat.label, content: stat.modalContent })}>
                      <h3 className="text-4xl font-bold text-cyan-300"><Counter to={stat.value} /></h3>
                      <p className="mt-1 text-xs text-gray-400 font-semibold">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Toolkit */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center"><FileText className="text-cyan-300 mr-3" /> Your Toolkit for Success</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {resources.map((resource) => (
                    <motion.div key={resource.title} className="text-center p-4 bg-gray-800/50 rounded-lg shadow-lg border border-white/10 cursor-pointer group" whileHover={{ y: -5, borderColor: '#67E8F9' }} onClick={() => setModalData({ title: resource.title, content: resource.modalContent })}>
                      <div className="text-red-400 w-10 h-10 mx-auto flex items-center justify-center">{resource.icon}</div>
                      <p className="mt-2 text-xs font-semibold text-white group-hover:text-cyan-300">{resource.title}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <LedModal isOpen={!!modalData} onClose={() => setModalData(null)} title={modalData?.title || ''}>
        {modalData && <ModalContentViewer content={modalData.content} />}
      </LedModal>

      <style>{`.bg-grid-pattern { background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }`}</style>
    </>
  );
};

export default QualityInActionSection;