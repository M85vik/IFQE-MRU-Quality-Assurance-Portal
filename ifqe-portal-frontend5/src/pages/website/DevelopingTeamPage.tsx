import React from 'react';
import WebsiteLayout from '../../components/layout/WebsiteLayout';
import { motion } from 'framer-motion';
import {
  User, Users, Code, Database, Layers, Flag, CheckCircle, ArrowDownCircle,
  MonitorSmartphone, Cloud, Zap, KeyRound, FolderArchive, FileStack, ServerCog, GitBranch
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

// TEAM DATA
const teamMembers = [
  {
    name: 'Harsh Vardhan Kumar Mishra',
    role: 'Lead Frontend Developer',
    roll: '2K22CSUN01066',
    dept: 'School of Engineering',
    email: 'harshvardhankumarmishra@gmail.com',
    phone: '9711738495',
    imageUrl: './portraits/hvkm.png',
  },
  {
    name: 'Vikas Sharma',
    role: 'Lead Backend Developer',
    roll: '2K22CSUN01082',
    dept: 'School of Engineering',
    email: '858sharma@gmail.com',
    phone: '85870 00747',
    imageUrl: './portraits/Vikas.jpeg',
  },
  {
    name: 'Gajal',
    role: 'Project Manager',
    roll: '2K22CSUN01230',
    dept: 'CSTI7',
    email: 'gajal_22@manavrachna.net',
    phone: '9053012355',
    imageUrl: './portraits/Gajal.jpeg',
  },
  {
    name: 'Rimjhim Verma',
    role: 'Junior Frontend Developer',
    roll: '2K23CSUN01108',
    dept: 'CSE-5B',
    email: 'rimjhimverma179@gmail.com',
    phone: '9540591587',
    imageUrl: './portraits/Rimjhim.jpeg',
  },
  {
    name: 'Somya Prabhakar',
    role: 'Junior Frontend Developer',
    roll: '2K23CSUN01119',
    dept: 'CSE-5B',
    email: 'somyaprabhkar300@gmail.com',
    phone: '8800673104',
    imageUrl: './portraits/Saumya.jpeg',
  },
  {
    name: 'Chandan Kumar',
    role: 'Junior Backend Developer',
    roll: '2k24CSUN01085',
    dept: 'School of Engineering',
    email: 'naryan.chandan2006@gmail.com',
    phone: '8800202689',
    imageUrl: './portraits/Miyamoto.jpeg',
  },
];

// DEVELOPMENT PHASES DATA
const devPhases = [
  {
    icon: <Flag size={30} className="text-red-600" />,
    title: 'Project Conceptualization',
    description: 'Defined objectives, gathered requirements, and shaped a vision for a comprehensive, user-focused quality enhancement portal.',
  },
  {
    icon: <Layers size={30} className="text-blue-600" />,
    title: 'Design & Prototyping',
    description: 'Created wireframes, user flows, and an intuitive UI/UX. Set a strong brand and information architecture foundation.',
  },
  {
    icon: <Code size={30} className="text-green-600" />,
    title: 'Frontend Engineering',
    description: 'Built a robust React + TypeScript SPA, with Tailwind CSS for styling, Framer Motion for animation, Zustand for state, and React Router for navigation.',
  },
  {
    icon: <Database size={30} className="text-purple-600" />,
    title: 'Backend Engineering',
    description: 'Developed a secure RESTful backend API using Node.js, Express, and MongoDB, with JWT authentication and AWS S3 for file storage.',
  },
  {
    icon: <CheckCircle size={30} className="text-amber-600" />,
    title: 'QA & Deployment',
    description: 'Tested and deployed on cloud infrastructure with CI/CD, version control using Git, and continuous project monitoring.',
  },
];

// TECH STACK
const techStackData = {
  backend: [
    {
      name: 'Node.js',
      logo: 'https://img.icons8.com/color/48/000000/nodejs.png',
      desc: 'Runtime for scalable server-side applications',
    },
    {
      name: 'Express.js',
      logo: 'https://img.icons8.com/?size=100&id=SDVmtZ6VBGXt&format=png&color=000000',
      desc: 'Minimalist web framework for Node.js',
    },
    {
      name: 'MongoDB',
      logo: 'https://img.icons8.com/color/48/000000/mongodb.png',
      desc: 'NoSQL document database',
    },
    {
      name: 'JWT',
      logo: 'https://img.icons8.com/ios/50/000000/security-checked--v1.png',
      desc: 'Secure JSON Web Token authentication',
    },
    {
      name: 'AWS S3',
      logo: 'https://img.icons8.com/color/48/000000/amazon-s3.png',
      desc: 'Cloud-based object storage',
    },
    {
      name: 'Archiver.js',
      logo: 'https://avatars.githubusercontent.com/u/10393396?s=200&v=4',
      desc: 'ZIP file generation utility',
    },
  ],
  frontend: [
    {
      name: 'React',
      logo: 'https://img.icons8.com/color/48/000000/react-native.png',
      desc: 'Declarative UI library',
    },
    {
      name: 'TypeScript',
      logo: 'https://img.icons8.com/color/48/000000/typescript.png',
      desc: 'Typed JavaScript superset',
    },
    {
      name: 'Vite',
      logo: 'https://vitejs.dev/logo.svg',
      desc: 'Frontend build tool with fast reload',
    },
    {
      name: 'Tailwind CSS',
      logo: 'https://img.icons8.com/color/48/000000/tailwind_css.png',
      desc: 'Utility-first CSS framework',
    },
    {
      name: 'Framer Motion',
      logo: 'https://cdn.prod.website-files.com/63c6a35ee97bea3e121bf3f4/65ba74cfb2137dde06f7004e_6475bf9f62e9be5d41eb4eea_framer-motion.webp',
      desc: 'Animation library for React',
    },
    {
      name: 'Zustand',
      logo: 'https://repository-images.githubusercontent.com/180328715/fca49300-e7f1-11ea-9f51-cfd949b31560',
      desc: 'State management library',
    },
    {
      name: 'React Router',
      logo: 'https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/2/react-router-afaraavuno5ulxx3m6dqif.png/react-router-iz5gsrt4bescjzyay2otud.png?_a=DATAg1AAZAA0',
      desc: 'Declarative routing for React',
    },
    {
      name: 'Axios',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRErtkYOAqYMqbkz_-fTbst58XLTRGzxz7k4w&s',
      desc: 'Promise based HTTP client',
    },
  ],
};

const cardFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DevelopingTeamPage() {
  return (
    <WebsiteLayout>
      <main className="bg-gradient-to-tr from-blue-50 via-white to-red-50 min-h-screen py-20 px-6 md:px-12 lg:px-32 space-y-20">

        {/* Hero and Team */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-5xl mx-auto text-center space-y-4"
        >
          <Users className="mx-auto text-blue-700 mb-6" size={60} />
          <h1 className="text-5xl font-extrabold text-blue-900 mb-3">
            IFQE Portal Developing Team
          </h1>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto">
            Meet the dedicated developers, project managers, and engineers who brought the IFQE portal to life at Manav Rachna University. Every name represents vision, expertise, and collaboration.
          </p>
        </motion.section>

        {/* TEAM MEMBERS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ staggerChildren: 0.14 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ scale: 1.07, rotate: -2 }}
              className="p-6 shadow-xl bg-white rounded-2xl flex flex-col items-center hover:shadow-2xl cursor-pointer transition-all ring-2 ring-blue-100 group"
            >
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-24 h-24 mb-4 rounded-full object-cover shadow-xl border-4 border-blue-600 group-hover:scale-110 transition"
                loading="lazy"
              />
              <h2 className="text-lg font-bold text-blue-800">{member.name}</h2>
              <span className="block text-sm font-semibold text-red-600 mt-1 mb-2">{member.role}</span>
              <div className="text-xs text-gray-600 mb-1">{member.dept}</div>
              <div className="text-xs text-gray-600">Roll: {member.roll}</div>
              <div className="mt-3 text-xs text-blue-900">
                <a href={`mailto:${member.email}`} className="underline">{member.email}</a>
              </div>
              <div className="text-xs text-gray-500">{member.phone}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* DEVELOPMENT TIMELINE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">The Project Journey</h2>
          <ol className="relative border-l-4 border-red-600 pl-8 space-y-16">
            {devPhases.map((step, idx) => (
              <motion.li
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                <div className="absolute -left-7 top-2 h-10 w-10 flex items-center justify-center rounded-full bg-white border-4 border-blue-300 shadow-lg">
                  {step.icon}
                </div>
                <div className="ml-8">
                  <h3 className="text-xl font-semibold text-blue-900">{step.title}</h3>
                  <p className="mt-1 text-gray-700 max-w-xl">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        {/* TECH STACKS DISPLAY */}
        <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto py-16"
      transition={{ staggerChildren: 0.15 }}
    >
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-900">
        Our Cutting-edge Technology Stack
      </h2>

      <div className="grid gap-10 md:grid-cols-2">
        {Object.entries(techStackData).map(([category, techs]) => (
          <div key={category} className="space-y-8">
            <h3 className="text-3xl font-semibold text-center text-red-600 capitalize mb-8">
              {category} Stack
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              {techs.map(({ name, logo, desc }, i) => (
                <motion.div
                  key={name}
                  variants={cardFade}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className="w-40 h-40 bg-white rounded-lg shadow-lg border-4 border-gradient-to-tr from-blue-500 to-red-500 flex flex-col items-center justify-center p-4 cursor-pointer transition-shadow"
                  title={`${name}: ${desc}`}
                  aria-label={`${name} logo and description`}
                >
                  <img src={logo} alt={`${name} logo`} className="w-16 h-16 object-contain mb-3" />
                  <div className="font-semibold text-md text-gray-800">{name}</div>
                  <p className="text-xs text-gray-600 mt-1 text-center">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
      </main>
    </WebsiteLayout>
  );
}
