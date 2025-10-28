// src/components/landing/CallToActionSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';

const CallToActionSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center overflow-hidden p-4 py-24 relative">
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* The "Screen" Container - NOW WHITE */}
        <motion.div 
          className="relative bg-white text-foreground rounded-2xl shadow-2xl p-12 md:p-16 text-center overflow-hidden border border-muted-DEFAULT"
          whileHover="hover"
          initial="rest"
        >
          {/* Interactive Shine/Gloss Effect */}
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-primary-DEFAULT/10 z-0"
            style={{ transform: 'rotate(45deg)' }}
            variants={{
                rest: { x: '-100%', skewX: -30 },
                hover: { x: '100%', skewX: -30 }
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          <div className="relative z-10">
            {/* Text is now dark and perfectly readable */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
              Take the Next Step
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Whether you're here to learn about our framework or to begin your submission, your journey starts here.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Main Action Button (Red) - High contrast on white */}
              <Link
                to="/criteria"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold px-8 py-3.5 rounded-lg transition-all duration-300 shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 transform hover:scale-105"
              >
                Explore the 7 Criteria <ArrowRight size={20} />
              </Link>
              
              {/* Secondary Action Button (Blue Outline) - High contrast on white */}
              <Link
                to="/login"
                className="bg-transparent hover:bg-primary-DEFAULT/10 text-primary-DEFAULT font-bold px-8 py-3.5 rounded-lg transition-colors duration-300 border-2 border-primary-DEFAULT w-full sm:w-auto flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <LogIn size={20} /> Portal Login
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;