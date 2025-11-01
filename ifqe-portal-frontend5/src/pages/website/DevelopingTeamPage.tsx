
import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import { Users, Linkedin, Mail, Phone } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

const teamMembers = [
  {
    name: 'Harsh Vardhan Kumar Mishra',
    role: 'Lead Frontend Developer',
    linkedin: 'https://linkedin.com/in/harshvardhankumarmishra',
    dept: 'School of Engineering',
    email: 'harshvardhankumarmishra@gmail.com',
    phone: '9711738495',
    imageUrl: './portraits/hvkm.png',
  },
  {
    name: 'Vikas Sharma',
    role: 'Lead Backend Developer',
    linkedin: 'https://www.linkedin.com/in/vikas-sharma0b/',
    dept: 'School of Engineering',
    email: '858sharma@gmail.com',
    phone: '8587000747',
    imageUrl: './portraits/Vikas.jpeg',
  },
  {
    name: 'Gajal',
    role: 'Project Manager',
    linkedin: 'https://www.linkedin.com/in/gajal-singhal-34871b24a/',
    dept: 'School of Engineering',
    email: 'gajal_22@manavrachna.net',
    phone: '9053012355',
    imageUrl: './portraits/Gajal.jpeg',
  },
  {
    name: 'Rimjhim Verma',
    role: 'Junior Frontend Developer',
    linkedin: 'https://www.linkedin.com/in/rimjhim-verma-599447290',
    dept: 'School of Engineering',
    email: 'rimjhimverma179@gmail.com',
    phone: '9540591587',
    imageUrl: './portraits/Rimjhim.jpeg',
  },
  {
    name: 'Somya Prabhakar',
    role: 'Junior Frontend Developer',
    linkedin: 'https://www.linkedin.com/in/somya-prabhakar-b64759285/',
    dept: 'School of Engineering',
    email: 'somyaprabhkar300@gmail.com',
    phone: '8800673104',
    imageUrl: './portraits/Saumya.jpeg',
  },
  {
    name: 'Chandan Kumar',
    role: 'Junior Backend Developer',
    linkedin: 'https://www.linkedin.com/in/chandan-kumar-80b21928a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    dept: 'School of Engineering',
    email: 'naryan.chandan2006@gmail.com',
    phone: '8800202689',
    imageUrl: './portraits/Miyamoto.jpeg',
  },
];

export default function DevelopingTeamPage() {
  return (
    <WebsiteLayout>
      <main className="min-h-screen py-20 px-6 md:px-12 lg:px-32 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100 relative overflow-hidden">

        {/* background glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.15),transparent_50%)]"></div>

        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center space-y-4 relative z-10"
        >
          <Users className="mx-auto text-blue-400 mb-6" size={70} />
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            IFQE Portal Development Team
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Meet the passionate developers and engineers who brought innovation, creativity, and dedication to building the IFQE portal.
          </p>
        </motion.section>

        {/* Team Members */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ staggerChildren: 0.14 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto mt-16 relative z-10"
        >
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl border border-gray-700 bg-white/10 backdrop-blur-md hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center"
            >
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-28 h-28 mb-4 rounded-full object-cover shadow-xl border-4 border-blue-600"
                loading="lazy"
              />
              <h2 className="text-xl font-bold text-white">{member.name}</h2>
              <span className="block text-sm font-semibold text-red-400 mt-1 mb-2">{member.role}</span>
              <div className="text-xs text-gray-400 mb-1">{member.dept}</div>

              <div className="mt-5 flex items-center justify-center gap-5">


                {/* Phone */}
                <a
                  href={`tel:${member.phone}`}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-green-400/40 hover:bg-green-500/20 transition duration-300"
                >
                  <Phone size={22} className="text-green-300" />
                </a>
                {/* Email Icon */}
                <a
                  href={`mailto:${member.email}`}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-400/40 hover:bg-blue-500/20 transition duration-300"
                >
                  <Mail size={22} className="text-blue-300" />
                </a>

                {/* LinkedIn Icon */}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-400/40 hover:bg-blue-500/20 transition duration-300"
                  >
                    <Linkedin size={22} className="text-blue-300" />
                  </a>
                )}
              </div>



            </motion.div>
          ))}
        </motion.section>

      </main>
    </WebsiteLayout>
  );
}
