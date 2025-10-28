// src/components/landing/InteractiveHubSection.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Check, X } from 'lucide-react';
import { wrap } from 'popmotion';

const questions = [
  {
    question: "Which of the 7 Pillars holds the highest weightage in the evaluation?",
    options: ["Student Lifecycle", "Academic Excellence", "Global Engagement"],
    correctAnswerIndex: 1,
    explanation: "Academic Excellence & Pedagogy and Research, Innovation & Impact both hold the highest weightage at 25% each."
  },
  {
    question: "What is the primary goal of 'Part A' of an IFQE submission?",
    options: ["Quantitative Scores", "An Executive Summary", "Faculty CVs"],
    correctAnswerIndex: 1,
    explanation: "Part A is a qualitative Executive Summary highlighting the school's vision, mission, SWOC analysis, and strategic plans."
  },
  {
    question: "Which framework is used for 'Criterion 7: Stakeholder Insights'?",
    options: ["ISO 9001", "Six Sigma", "Net Promoter Score (NPS)"],
    correctAnswerIndex: 2,
    explanation: "Criterion 7 uses the Net Promoter Score (NPS) framework to measure stakeholder satisfaction and drive continuous improvement."
  },
];

const cardVariants = {
    enter: { opacity: 0, scale: 0.9 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

const InteractiveHubSection: React.FC = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const activeQuestion = questions[questionIndex];
    const isCorrect = selectedAnswer === activeQuestion.correctAnswerIndex;

    const handleAnswer = (answerIndex: number) => {
        if (isAnswered) return;
        setSelectedAnswer(answerIndex);
        setIsAnswered(true);

        setTimeout(() => {
            setIsAnswered(false);
            setSelectedAnswer(null);
            setQuestionIndex(prevIndex => wrap(0, questions.length, prevIndex + 1));
        }, 3000);
    };

    return (
        <section className="min-h-screen bg-secondary-DEFAULT text-foreground flex flex-col items-center justify-center overflow-hidden p-4 py-24">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <Lightbulb className="w-12 h-12 text-primary-DEFAULT mx-auto mb-4" />
                    <h2 className="text-4xl md:text-5xl font-extrabold">
                        Interactive Knowledge Hub
                    </h2>
                    <p className="text-muted-foreground mt-4">Test your knowledge about the IFQE framework.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Illustration */}
                    <motion.div 
                        className="hidden md:block"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        viewport={{ once: true }}
                    >
                        <img src="/illustrations/knowledge_hub.png" alt="Illustration of people learning and collaborating" className="w-full h-auto" />
                    </motion.div>

                    {/* Right Column: Interactive Quiz Card */}
                    <div className="relative h-96">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={questionIndex}
                                className="absolute w-full"
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <div className="bg-white p-8 rounded-xl shadow-2xl border border-muted-DEFAULT">
                                    <h3 className="text-xl font-bold text-center mb-6 h-16">{activeQuestion.question}</h3>
                                    <div className="space-y-3">
                                        {activeQuestion.options.map((option, index) => {
                                            const getButtonClass = () => {
                                                if (!isAnswered) return "bg-gray-100 hover:bg-gray-200";
                                                if (index === activeQuestion.correctAnswerIndex) return "bg-green-500 text-white";
                                                if (index === selectedAnswer) return "bg-red-500 text-white";
                                                return "bg-gray-100 opacity-50";
                                            };
                                            return (
                                                <button
                                                    key={index}
                                                    className={`w-full text-left p-4 rounded-lg font-semibold transition-all duration-300 ${getButtonClass()}`}
                                                    onClick={() => handleAnswer(index)}
                                                    disabled={isAnswered}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <AnimatePresence>
                                    {isAnswered && (
                                        <motion.div 
                                            className="mt-4 text-center p-3 rounded-lg"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{ backgroundColor: isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)' }}
                                        >
                                            <p className="text-sm text-muted-foreground">{activeQuestion.explanation}</p>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveHubSection;