import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Globe,
  ThumbsUp
} from "lucide-react";

const pillars = [
  {
    title: "Academic Excellence & Pedagogy",
    color: "from-indigo-300 via-blue-200 to-blue-100",
    icon: <BookOpen className="w-10 h-10 text-indigo-700" />,
    description: "Embracing academic innovation through effective pedagogy, outcomes-based learning, and continuous quality improvement."
  },
  {
    title: "Research, Innovation & Impact",
    color: "from-pink-200 via-rose-400 to-yellow-200",
    icon: <TrendingUp className="w-10 h-10 text-rose-600" />,
    description: "Fostering curiosity-driven research and innovation that positively impacts communities, industries, and society."
  },
  {
    title: "Student Lifecycle & Engagement",
    color: "from-emerald-100 via-green-200 to-lime-100",
    icon: <Users className="w-10 h-10 text-green-700" />,
    description: "Cultivating inclusive growth through engagement, mentoring, leadership programs, and student success systems."
  },
  {
    title: "Faculty Development & Diversity",
    color: "from-orange-100 via-yellow-200 to-amber-200",
    icon: <Award className="w-10 h-10 text-amber-600" />,
    description: "Empowering educators through global exposure, peer learning, and multidisciplinary collaboration."
  },
  {
    title: "Institutional Governance & Strategic Vision",
    color: "from-fuchsia-100 via-indigo-200 to-cyan-100",
    icon: <Briefcase className="w-10 h-10 text-indigo-600" />,
    description: "Leading institutional transformation with clear vision, transparency, and effective governance mechanisms."
  },
  {
    title: "Global Engagement & Collaborations",
    color: "from-cyan-100 via-sky-200 to-blue-200",
    icon: <Globe className="w-10 h-10 text-sky-800" />,
    description: "Promoting intercultural learning, global network partnerships, and worldwide academic collaboration."
  },
  {
    title: "Stakeholder Insights & Continuous Improvement",
    color: "from-fuchsia-100 via-rose-200 to-amber-200",
    icon: <ThumbsUp className="w-10 h-10 text-pink-600" />,
    description: "Integrating useful feedback loops that drive ongoing enhancement and sustained educational excellence."
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export default function PillarsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-blue-100 via-pink-50 to-amber-50 min-h-[90vh]">
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2"
        >
          IFQE&nbsp;7 Pillars of Excellence
        </motion.h2>
        <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-pink-500 mb-4" />
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Our institutional quality framework is scaffolded on seven bold, future-ready pillars. Each one shapes holistic progress and sustainable excellence at Manav Rachna University.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            className="rounded-3xl shadow-2xl bg-white/90 border-4 border-transparent hover:border-blue-200 transition-all px-7 py-10 flex flex-col items-center relative overflow-hidden group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: i * 0.12, type: "spring", bounce: 0.4 }}
          >
            {/* Dynamic radial gradient accent */}
            <div className={`absolute z-0 left-1/2 top-2 -translate-x-1/2 w-44 h-44 blur-2xl rounded-full opacity-40 group-hover:opacity-60 transition bg-gradient-to-tr ${pillar.color}`} />
            <div className="z-10 relative mb-6">{pillar.icon}</div>
            <h3 className="text-xl font-bold text-blue-900 z-10 text-center mb-3">{pillar.title}</h3>
            <p className="text-gray-700 text-center z-10">{pillar.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
