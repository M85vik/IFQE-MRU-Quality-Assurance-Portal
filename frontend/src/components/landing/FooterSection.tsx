// src/components/landing/FooterSection.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Linkedin, Twitter, Facebook, Instagram, ArrowUp } from 'lucide-react';

// --- FAQ Data (from your FaqSection component) ---
const faqs = [
  {
    question: "What is the purpose of the IFQE Portal?",
    answer: "The IFQE Portal is a digital platform designed to streamline the quality assurance process at Manav Rachna University. It helps departments submit reports and allows the QAA team to review them in a centralized, data-driven environment."
  },
  {
    question: "Who is this portal for?",
    answer: "The portal is designed for university departments who submit quality reports, the Quality Assurance & Accreditation (QAA) office who reviews them, and university leadership who analyze the resulting data for strategic planning."
  },
  {
    question: "How does the evaluation process work?",
    answer: "The evaluation is based on the 7 Core Criteria of the IFQE framework. Departments submit evidence against 125 performance indicators, which are then reviewed and scored by the QAA team to generate a comprehensive quality report."
  },
  {
    question: "Where can I find the templates and guidelines?",
    answer: "All official documents, including the evaluation matrix, rubrics, guidelines, and standardized templates, are available in the Resources section of this website."
  }
];

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-muted-DEFAULT">
            <button
                className="w-full flex justify-between items-center text-left py-6"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-semibold text-foreground">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-6 h-6 text-primary-DEFAULT" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-muted-foreground">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FooterSection: React.FC = () => {
  return (
    <section className="bg-background text-foreground flex flex-col justify-between overflow-hidden">
      {/* FAQ Content */}
      <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-4xl mx-auto w-full">
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-center mb-12"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="bg-white p-8 rounded-lg shadow-xl border border-muted-DEFAULT">
                {faqs.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
          </div>
      </div>
    </section>
  );
};

export default FooterSection;