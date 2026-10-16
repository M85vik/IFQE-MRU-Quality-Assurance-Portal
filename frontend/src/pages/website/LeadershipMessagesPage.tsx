import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';

const leaders = [
  {
    name: 'Prof. (Dr.) Deependra Kumar Jha',
    title: 'Vice-Chancellor, Manav Rachna University',
    message:
      "The second cycle of the Institutional Framework for Quality Enhancement (IFQE) 2026 marks another significant milestone in Manav Rachna University’s pursuit of academic excellence and institutional distinction. Building on the foundation laid in the first cycle, it reaffirms our commitment to a strong quality culture woven into every aspect of university life. By aligning our practices with national and global benchmarks, IFQE strengthens accountability, fosters innovation and nurtures a shared responsibility for continuous improvement. It ensures that quality remains not merely an institutional goal, but a collective commitment embraced by every stakeholder in our journey towards excellence.",
    imageUrl: './portraits/Prof. (Dr.) Deependra Kumar Jha.png',
  },
  {
    name: 'Prof. (Dr.) Sangita Banga',
    title: 'Pro Vice-Chancellor, Manav Rachna University',
    message:
      "At Manav Rachna University, quality is viewed as an evolving pursuit—one that demands continuous reflection, thoughtful refinement, and the courage to innovate. Guided by the Institutional Framework for Quality Enhancement (IFQE), the University embeds evidence-based reflection and continuous assessment into all academic practices. Within this framework, assessment serves as a dynamic feedback loop that sharpens learning outcomes, refines teaching methodologies, and sustains academic rigor across disciplines. To meet the rapidly shifting demands of modern higher education, the IFQE empowers the University to proactively adapt its curricula to interdisciplinary trends, digital integration, and evolving industry expectations. This relentless focus on quality ensures that our academic, research, and institutional metrics consistently align with global benchmarks and standards set by premier accrediting and ranking bodies. Ultimately, sustainable excellence is achieved not through isolated interventions, but through a shared culture of learning, collaboration, and purposeful transformation. Through the frameworks codified in this document, we reaffirm our commitment to elevating institutional standards, fostering innovation, and empowering our graduates to excel in a dynamic global landscape.",
    imageUrl: './portraits/Prof. (Dr.) Sangita Banga.png',
  },
  {
    name: 'Prof. (Dr.) Deepa Arora',
    title: 'Director, Quality Assurance & Accreditation',
    message:
      "The Institutional Framework for Quality Enhancement (IFQE) is a structured approach to embedding quality assurance and continuous improvement into the university's academic and administrative ecosystem. Beyond evaluation, it enables systematic reflection, evidence-based decision-making, and the identification of opportunities for meaningful enhancement. By establishing clearly defined quality benchmarks across teaching and learning, research, governance, and student support, IFQE promotes consistency, transparency, and institutional accountability while respecting the diverse academic contexts across the university. As a framework for sustained quality enhancement, it empowers stakeholders to translate insights into actionable improvements, strengthen institutional performance, and advance a culture of excellence aligned with evolving national and global expectations.",
    imageUrl: './portraits/Deepa-Arora.jpg',
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
