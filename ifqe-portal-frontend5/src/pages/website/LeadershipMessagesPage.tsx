import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';

const leaders = [
  {
    name: 'Dr. Prashant Bhalla',
    title: 'Chancellor, Manav Rachna University',
    message: "The IFQE framework represents a significant leap forward in our relentless pursuit of academic excellence. It institutionalizes our commitment to quality and ensures that every stakeholder is an active participant in our journey of continuous improvement.",
    imageUrl: './portraits/Dr. Prashant Bhalla.webp',
  },
  {
    name: 'Prof. (Dr.) Deependra Kumar Jha',
    title: 'Vice-Chancellor, Manav Rachna University',
    message: "This initiative is a cornerstone of the MRU 2.0 evolution. By establishing a comprehensive framework for quality enhancement, we are not only aligning with national and global standards but are also fostering a culture of accountability and innovation from the ground up.",
    imageUrl: './portraits/Prof. (Dr.) Deependra Kumar Jha.png',
  },
  {
    name: 'Prof. (Dr.) Deepa Arora',
    title: 'Director, Quality Assurance & Accreditation',
    message: "The IFQE is more than a mechanism for evaluation; it's a testament to our university's allegiance to quality. This structured, dual-approach model empowers us to make data-informed decisions while valuing the rich academic experiences across our institution.",
    imageUrl: './portraits/Dr.Deepa.webp',
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function LeadershipMessagesPage() {
  return (
    <WebsiteLayout>
      <main className="min-h-screen bg-gradient-to-t from-blue-50 to-white py-16 px-6 md:px-20 lg:px-32">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-5xl mx-auto mb-16"
        >
          <MessageSquareQuote className="inline-block mb-4 text-blue-700" size={60} />
          <h1 className="text-5xl font-extrabold text-blue-900 mb-3">
            Leadership Messages
          </h1>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Insights from the visionary leaders guiding Manav Rachna University’s commitment
            to institutional excellence through the IFQE framework and continuous quality enhancement.
          </p>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {leaders.map((leader, idx) => (
            <motion.article
              key={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-2xl transition"
              aria-label={`Message from ${leader.name}, ${leader.title}`}
            >
              <img
                src={leader.imageUrl}
                alt={`Portrait of ${leader.name}`}
                className="rounded-full w-32 h-32 object-cover shadow-lg mb-6 border-4 border-blue-600"
                loading="lazy"
              />
              <h2 className="text-2xl font-semibold text-blue-800 mb-1">{leader.name}</h2>
              <p className="text-sm uppercase tracking-widest text-red-600 mb-4">{leader.title}</p>
              <blockquote className="italic text-gray-700 font-medium">
                &ldquo;{leader.message}&rdquo;
              </blockquote>
            </motion.article>
          ))}
        </motion.section>
      </main>
    </WebsiteLayout>
  );
}
