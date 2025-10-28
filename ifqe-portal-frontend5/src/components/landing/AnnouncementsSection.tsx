// src/components/landing/AnnouncementsSection.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, Clock, ArrowRight, Inbox, LucideProps } from 'lucide-react'; // 1. Import LucideProps
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
  icon: React.ReactElement<LucideProps>; // 2. Use the specific LucideProps type
}

const getIconForCategory = (category: string): React.ReactElement<LucideProps> => { // 3. Update return type
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
    if (announcements === null) {
      return <Spinner size="lg" />;
    }

    if (announcements.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <Inbox size={48} className="mx-auto" />
          <p className="mt-4 font-semibold">No active announcements at this time.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {announcements.map((item) => (
          <motion.div
            key={item._id}
            className="bg-white rounded-xl shadow-lg border-b-4 overflow-hidden relative"
            style={{ borderColor: item.color === 'blue' ? '#0A4D8C' : item.color === 'red' ? '#D90429' : '#6C757D' }}
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <div className="p-8 flex flex-col text-left h-full">
                <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full mr-4" style={{ backgroundColor: item.color === 'blue' ? 'rgba(10, 77, 140, 0.1)' : item.color === 'red' ? 'rgba(217, 4, 41, 0.1)' : 'rgba(108, 117, 125, 0.1)', color: item.color === 'blue' ? '#0A4D8C' : item.color === 'red' ? '#D90429' : '#6C757D' }}>
                        {/* This line is now type-safe and will not cause an error */}
                        {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <div>
                        <span className="text-sm font-bold" style={{ color: item.color === 'blue' ? '#0A4D8C' : item.color === 'red' ? '#D90429' : '#6C757D' }}>{item.category}</span>
                        <p className="text-xs text-muted-foreground font-semibold">{item.date}</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground flex-grow">{item.summary}</p>
            </div>
            <motion.div
                className="absolute bottom-0 left-0 w-full bg-white p-8 flex flex-col border-t-2"
                style={{ borderColor: item.color === 'blue' ? '#0A4D8C' : item.color === 'red' ? '#D90429' : '#6C757D' }}
                variants={{ rest: { y: "100%" }, hover: { y: "0%" } }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <div className="border-b border-muted-DEFAULT my-3"></div>
                <p className="text-sm text-muted-foreground flex-grow">{item.details}</p>
                <a href="#" className="mt-4 font-bold text-white flex items-center self-start bg-primary-DEFAULT px-4 py-2 rounded-md hover:bg-primary-DEFAULT/80">
                    Learn More <ArrowRight size={16} className="ml-2" />
                </a>
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center overflow-hidden p-4 py-24">
      <div className="text-center max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-12"
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