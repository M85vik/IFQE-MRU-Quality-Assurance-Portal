
// src/components/landing/AnnouncementsSection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Clock, ArrowRight, Inbox, LucideProps } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import Spinner from '../shared/Spinner';

interface Announcement {
  _id: string;
  category: string;
  title: string;
  summary: string;
  details?: string;
  date: string;
  color: 'blue' | 'red' | 'gray';
  icon: React.ReactElement<LucideProps>;
}

const getIconForCategory = (category: string): React.ReactElement<LucideProps> => {
  switch (category) {
    case 'Workshop': return <Megaphone />;
    case 'Deadline': return <Calendar />;
    case 'System Update': return <Clock />;
    default: return <Megaphone />;
  }
};

const AnnouncementsSection: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await apiClient.get('/public/announcements');
        if (Array.isArray(data)) {
          const announcementsWithIcons = data.map((ann: any) => ({
            ...ann,
            icon: getIconForCategory(ann.category),
          }));
          setAnnouncements(announcementsWithIcons);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
  }, []);

  const renderContent = () => {
    if (announcements === null) return <Spinner size="lg" />;

    if (announcements.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          <Inbox size={64} className="mx-auto" />
          <p className="mt-6 text-lg font-semibold">
            No active announcements at this time.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-11 px-6">
        {announcements.map((item) => (
          <motion.div
            key={item._id}
            className="bg-white rounded-2xl shadow-xl border-b-4 overflow-hidden relative transition-all"
            style={{
              borderColor:
                item.color === 'blue'
                  ? '#0A4D8C'
                  : item.color === 'red'
                  ? '#D90429'
                  : '#6C757D',
              minHeight: '480px', // 👈 Bigger height
         
            }}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            {/* Card Top Content */}
            <div className="p-10 flex flex-col text-left h-full  min-h-[350px]">
              <div className="flex items-center mb-6">
                <div
                  className="p-4 rounded-full mr-5"
                  style={{
                    backgroundColor:
                      item.color === 'blue'
                        ? 'rgba(10, 77, 140, 0.1)'
                        : item.color === 'red'
                        ? 'rgba(217, 4, 41, 0.1)'
                        : 'rgba(108, 117, 125, 0.1)',
                    color:
                      item.color === 'blue'
                        ? '#0A4D8C'
                        : item.color === 'red'
                        ? '#D90429'
                        : '#6C757D',
                  }}
                >
                  {React.cloneElement(item.icon, { size: 36 })} {/* bigger icon */}
                </div>
                <div>
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color:
                        item.color === 'blue'
                          ? '#0A4D8C'
                          : item.color === 'red'
                          ? '#D90429'
                          : '#6C757D',
                         
                    }}
                  >
                    {item.category}
                  </span>
                  <p className="text-lg text-gray-500 font-semibold mt-1">
                    {item.date}
                  </p>
                </div>
              </div>

              <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed flex-grow">
                {item.summary}
              </p>
            </div>

            {/* Hover Slide-up Content */}
            <motion.div
              className="absolute bottom-0 left-0 w-full bg-white p-10 flex flex-col border-t-2"
              style={{
                borderColor:
                  item.color === 'blue'
                    ? '#0A4D8C'
                    : item.color === 'red'
                    ? '#D90429'
                    : '#6C757D',
                     minHeight: '480px',
              }}
              variants={{ rest: { y: '100%' }, hover: { y: '0%' } }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <div className="border-b border-gray-200 mb-4"></div>
              <p className="text-lg text-gray-600 flex-grow leading-relaxed">
                {item.details}
              </p>
              <a
                href="#"
                className="mt-6 font-bold text-white flex items-center self-start px-6 py-3 rounded-md text-lg transition-all"
                style={{
                  backgroundColor:
                    item.color === 'blue'
                      ? '#0A4D8C'
                      : item.color === 'red'
                      ? '#D90429'
                      : '#6C757D',
                }}
              >
                Learn More <ArrowRight size={20} className="ml-2" />
              </a>
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 bg-[#FBF8EF] text-gray-900 ">
      <div className="max-w-[90rem] mx-auto text-center">
        <motion.h2
          className="text-6xl font-extrabold mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Stay Informed. Stay Ahead.
        </motion.h2>
        {renderContent()}
      </div>
    </section>
  );
};

export default AnnouncementsSection;
