
// import React, { useState, useEffect } from 'react';
// import { getSchoolPerformanceData, getApprovedSubmissions } from '../../services/adminService';
// import useSecureDownloader from '../../hooks/useSecureDownloader';
// import Card from '../../components/shared/Card';
// import Spinner from '../../components/shared/Spinner';
// import Alert from '../../components/shared/Alert';
// import Button from '../../components/shared/Button';
// import { BarChart3, Archive, Download } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// interface ChartData {
//   schoolId: string;
//   schoolName: string;
//   finalScore: number;
// }

// const ScoreboardChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
//     if (!data || data.length === 0) return null;

//     return (
//         <div style={{ width: '100%', height: 300 }}>
//             <ResponsiveContainer>
//                 <BarChart
//                     data={data}
//                     layout="vertical"
//                     margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 14, 14, 0.1)" />
//                     <XAxis type="number" domain={[0, 500]} stroke="#2222aeff" />
//                     <YAxis 
//                         type="category" 
//                         dataKey="schoolName" 
                        
//                         width={120} 
//                         stroke="#2222aeff" 
//                         tick={{ fontSize: 12 }}
//                     />
//                     <Tooltip
//                         cursor={{ fill: 'rgba(23, 22, 22, 0.05)' }}
//                         contentStyle={{ 
//                             background: 'hsla(223, 68%, 76%, 1.00)',
//                             borderColor: 'hsla(217, 89%, 48%, 1.00)'
//                         }}
//                     />
//                     <Bar dataKey="finalScore" fill="#181662ff" name="Final Score" barSize={20} />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// const AdminDashboard: React.FC = () => {
//   const [performanceData, setPerformanceData] = useState<ChartData[]>([]);
//   const [approvedSubmissions, setApprovedSubmissions] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   const availableYears = ["2025-2026", "2024-2025", "2023-2024"];
//   const [selectedYear, setSelectedYear] = useState(availableYears[0]);
//   const { downloadFile, isDownloading } = useSecureDownloader();

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError('');
//       try {
//         const perfPromise = getSchoolPerformanceData(selectedYear);
//         const approvedPromise = getApprovedSubmissions();
//         const [perfData, approvedData] = await Promise.all([perfPromise, approvedPromise]);
        
//         const sortedData = [...perfData].sort((a: ChartData, b: ChartData) => a.finalScore - b.finalScore);
//         setPerformanceData(sortedData);
//         setApprovedSubmissions(approvedData);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [selectedYear]);

//   const renderAnalyticsContent = () => {
//     if (isLoading) return <div className="p-6"><Spinner /></div>;
//     if (error) return <div className="p-6"><Alert message={error} type="error" /></div>;
//     if (performanceData.length === 0) {
//         return <p className="text-center text-muted-foreground py-8">No approved submissions with scores found for {selectedYear} to generate analytics.</p>;
//     }
//     return <ScoreboardChart data={performanceData} />;
//   };

//   const renderApprovedTable = () => {
//       if (isLoading) return <div className="p-6"><Spinner /></div>;
//       if (approvedSubmissions.length === 0) {
//           return <p className="text-center text-muted-foreground py-8">There are no approved submissions yet.</p>;
//       }
//       return (
//           <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-border">
//                   <thead className="bg-secondary/50">
//                       <tr className="bg-muted/70 text-foreground/90">
//     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Title</th>
//     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">School</th>
//     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Department</th>
//     <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Archive</th>
// </tr>

//                   </thead>
//                   <tbody className="bg-card divide-y divide-border">
//                       {approvedSubmissions.map((sub: any) => (
//                           <tr key={sub._id} className="hover:bg-accent">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{sub.title}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sub.school.name}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sub.department.name}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                   {sub.archiveFileKey ? (
//                                       <Button onClick={() => downloadFile(sub.archiveFileKey)} size="sm" variant="secondary" isLoading={isDownloading}>
//                                           <Download size={16} className="mr-2"/> Download ZIP
//                                       </Button>
//                                   ) : (
//                                       <span className="text-xs text-muted-foreground italic">Archiving...</span>
//                                   )}
//                               </td>
//                           </tr>
//                       ))}
//                   </tbody>
//               </table>
//           </div>
//       );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h1 className="text-3xl font-bold" style={{ color: '#083D77' }}>
//   University Analytics
// </h1>

//         <div className="flex-shrink-0 w-full sm:w-auto">
//             <label htmlFor="year-select" className="block text-sm font-medium text-muted-foreground mb-1 sm:hidden">Academic Year:</label>
//             <select
//                 id="year-select"
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 className="w-full p-2 border border-input bg-background rounded-md shadow-sm focus:ring-ring"
//             >
//                 {availableYears.map(year => (
//                     <option key={year} value={year}>{year}</option>
//                 ))}
//             </select>
//         </div>
//       </div>
      
//       <Card className="p-0">
//         <div className="px-6 py-4 border-b border-border bg-muted/70 rounded-t-lg">
//     <h2 className="text-xl font-semibold text-foreground/90 flex items-center gap-3">
//         <BarChart3 size={22} className="text-foreground/90" /> 
//         Total Score by School
//     </h2>
//     <p className="text-sm text-foreground/70 mt-1">
//         Total review scores for all approved submissions for the selected year.
//     </p>
// </div>

//         <div className="p-6">
//             {renderAnalyticsContent()}
//         </div>
//       </Card>

//       <Card className="p-0">
//         <div className="px-6 py-4 border-b border-border bg-muted/70 rounded-t-lg">
//     <h2 className="text-xl font-semibold text-foreground/90 flex items-center gap-3">
//         <Archive size={22} className="text-foreground/90" />
//         Approved & Archived Submissions
//     </h2>
//     <p className="text-sm text-foreground/70 mt-1">
//         Download the final ZIP archive for any approved submission.
//     </p>
// </div>

//         {renderApprovedTable()}
//       </Card>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import {
  getSchoolPerformanceData,
  getApprovedSubmissions
} from '../../services/adminService';

import useArchiveDownloader from '../../hooks/useArchiveDownloader.tsuseArchiveDownloader';

import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Button from '../../components/shared/Button';

import {
  BarChart3,
  Archive,
  Download
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------

interface ChartData {
  schoolId: string;
  schoolName: string;
  finalScore: number;
}

interface Submission {
  _id: string;
  title: string;
  school: { name: string };
  department: { name: string };
  academicYear: string;
  status: string;
  archive?: {
    status: 'Not Generated' | 'In Progress' | 'Completed' | 'Failed';
    fileKey?: string;
  };
}

// ------------------------------------------------------------------
// CHART
// ------------------------------------------------------------------

const ScoreboardChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15, 14, 14, 0.1)"
          />
          <XAxis type="number" domain={[0, 500]} stroke="#FA8112" />
          <YAxis
            type="category"
            dataKey="schoolName"
            width={120}
            stroke="#FA8112"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(23, 22, 22, 0.05)' }}
            contentStyle={{
              background: 'hsla(223, 68%, 76%, 1.00)',
              borderColor: 'hsla(217, 89%, 48%, 1.00)'
            }}
          />
          <Bar
            dataKey="finalScore"
            fill="white"
            name="Final Score"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ------------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------------

const AdminDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<ChartData[]>([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const availableYears = ['2025-2026', '2024-2025', '2023-2024'];
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  // ✅ NEW HOOK (archive-specific)
  const { downloadArchive, isDownloading } = useArchiveDownloader();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [perfData, approvedData] = await Promise.all([
          getSchoolPerformanceData(selectedYear),
          getApprovedSubmissions()
        ]);

        const sortedData = [...perfData].sort(
          (a: ChartData, b: ChartData) => a.finalScore - b.finalScore
        );

        setPerformanceData(sortedData);
        setApprovedSubmissions(approvedData);

      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // ------------------------------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------------------------------

  const renderAnalyticsContent = () => {
    if (isLoading) return <div className="p-6"><Spinner /></div>;
    if (error) return <div className="p-6"><Alert message={error} type="error" /></div>;
    if (performanceData.length === 0) {
      return (
        <p className="text-center text-black py-8">
          No approved submissions with scores found for {selectedYear}.
        </p>
      );
    }
    return <ScoreboardChart data={performanceData} />;
  };

  const renderApprovedTable = () => {
    if (isLoading) return <div className="p-6"><Spinner /></div>;
    if (approvedSubmissions.length === 0) {
      return (
        <p className="text-center text-black py-8">
          There are no approved submissions yet.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y  divide-border">
          <thead className="bg-[#fdfdfd]">
            <tr className="bg-muted/70 text-black">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                School
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Archive
              </th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border">
            {approvedSubmissions.map(sub => (
              <tr key={sub._id} className="hover:bg-accent">
                <td className="px-6 py-4 text-sm font-medium">
                  {sub.title}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {sub.school?.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {sub.department?.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  {sub.archive?.status === 'Completed' ? (
                    <Button
                      onClick={() => downloadArchive(sub._id)}
                      size="sm"
                      variant="secondary"
                      isLoading={isDownloading}
                    >
                      <Download size={16} className="mr-2" />
                      Download ZIP
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      {sub.archive?.status === 'In Progress'
                        ? 'Archiving...'
                        : 'Not Archived'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold" style={{ color: '#222222' }}>
          University Analytics
        </h1>

        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="p-2 border border-input bg-background rounded-md text-black "
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Card className="p-0 bg-[#37353E]">
        <div className="px-6 py-4 border-b border-border bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <BarChart3 size={22} /> Total Score by School
          </h2>
          <p className="text-sm text-black mt-1">
            Total review scores for approved submissions.
          </p>
        </div>
        <div className="p-6">{renderAnalyticsContent()}</div>
      </Card>

      <Card className="p-0 bg-[#37353E] ">
        <div className="px-6 py-4 border-b border-border bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <Archive size={22} /> Approved & Archived Submissions
          </h2>
          <p className="text-sm text-black mt-1">
            Download the final ZIP archive.
          </p>
        </div>

        {renderApprovedTable()}
      </Card>
    </div>
  );
};

export default AdminDashboard;
