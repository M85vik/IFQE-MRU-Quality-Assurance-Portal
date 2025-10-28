import React from "react";
import { motion } from "framer-motion";

const frameworkPillars = [
  {
    title: "Vision & Mission Alignment",
    description: "Ensuring all academic programs are aligned with the University’s vision and mission.",
    gradient: "from-indigo-300 via-blue-200 to-blue-100",
  },
  {
    title: "Data-driven Decision Making",
    description: "Utilizing effective data metrics to guide institutional strategies.",
    gradient: "from-pink-200 via-rose-300 to-yellow-200",
  },
  {
    title: "Continuous Improvement",
    description: "Implementing a culture of constant evaluation and enhancement in all activities.",
    gradient: "from-emerald-200 via-lime-300 to-yellow-100",
  },
  {
    title: "Stakeholder Engagement",
    description: "Involving students, faculty, and external partners in quality enhancement.",
    gradient: "from-purple-200 via-pink-200 to-pink-100",
  },
  {
    title: "Quality Assurance Systems",
    description: "Maintaining rigorous internal and external quality standards.",
    gradient: "from-teal-300 via-cyan-200 to-blue-200",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

export default function FrameworkSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-pink-50 to-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto text-center px-5">
        <h2 className="text-4xl font-extrabold text-indigo-900 mb-3">
          IFQE Institutional Framework
        </h2>
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full w-24 mx-auto mb-12" />
        <p className="text-gray-600 max-w-xl mx-auto mb-20 leading-relaxed">
          The framework integrates best practices for academic quality,
          stakeholder inclusion, continuous data-driven improvement, and sustainable governance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {frameworkPillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className={`rounded-xl p-8 shadow-lg bg-gradient-to-tr ${pillar.gradient} text-indigo-900 flex flex-col items-start`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: i * 0.12, type: "spring", bounce: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
              <p className="text-gray-700">{pillar.description}</p>
              <div className="mt-auto rounded-full h-2 w-20 bg-indigo-600" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
