// // src/pages/department/ArchivesPage.tsx

// import React, { useState, useEffect, useMemo } from 'react';
// import { getMyDepartmentSubmissions } from '../../services/submissionService';
// import useSecureDownloader from '../../hooks/useSecureDownloader';
// import Card from '../../components/shared/Card';
// import Button from '../../components/shared/Button';
// import Spinner from '../../components/shared/Spinner';
// import { Archive, Download, Inbox } from 'lucide-react';

// interface Submission {
//   _id: string;
//   title: string;
//   academicYear: string;
//   status: 'Completed' | 'Appeal Closed' | 'Approved';
//   hasAppealed: boolean;
//   archiveFileKey?: string;
// }

// const ArchivesPage: React.FC = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { downloadFile, isDownloading } = useSecureDownloader();

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         const data = await getMyDepartmentSubmissions();
//         setSubmissions(data);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSubmissions();
//   }, []);


//   // const archivedSubmissions = useMemo(() => 
//   //   submissions.filter(sub => sub.archiveFileKey && (['Appeal Closed', 'Approved'].includes(sub.status) || (sub.status === 'Completed' && sub.hasAppealed))),
//   //   [submissions]
//   // );
//   // Fix Archive fix with respect to submisiion status 

//   const archivedSubmissions = useMemo(() =>
//     submissions.filter(sub =>
//       sub.archiveFileKey &&
//       ['Completed', 'Appeal Closed', 'Approved'].includes(sub.status)
//     ),
//     [submissions]
//   );

//   if (isLoading) return <Spinner size="lg" />;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-primary-DEFAULT">Archived Submissions</h1>
//       <Card className="p-0">
//         <div className="px-6 py-4 border-b border-border flex items-center gap-3">
//           <Archive className="text-green-500" />
//           <h2 className="text-xl font-semibold">Completed Archives ({archivedSubmissions.length})</h2>
//         </div>
//         {archivedSubmissions.length > 0 ? (
//           <table className="min-w-full"><thead className="bg-secondary/50"><tr><th className="px-6 py-3 text-left text-xs uppercase">Title</th><th className="px-6 py-3 text-left text-xs uppercase">Academic Year</th><th className="relative px-6 py-3"></th></tr></thead>
//             <tbody className="divide-y divide-border">{archivedSubmissions.map(sub => (<tr key={sub._id} className="hover:bg-accent"><td className="px-6 py-4 font-medium">{sub.title}</td><td className="px-6 py-4 text-sm">{sub.academicYear}</td><td className="px-6 py-4 text-right"><Button onClick={() => downloadFile(sub.archiveFileKey!)} variant="secondary" isLoading={isDownloading}><Download size={16} className="mr-2" /> Download ZIP</Button></td></tr>))}</tbody></table>
//         ) : <div className="text-center py-16 text-muted-foreground"><Inbox size={48} className="mx-auto" /><p className="mt-4 font-semibold">No submissions have been archived yet.</p></div>}
//       </Card>
//     </div>
//   );
// };

// export default ArchivesPage;


// src/pages/department/ArchivesPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { getMyDepartmentSubmissions } from '../../services/submissionService';
import useSecureDownloader from '../../hooks/useSecureDownloader';
import CardWhite from '../../components/shared/CardWhite';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import { Archive, Download, Inbox } from 'lucide-react';
import useArchiveDownloader from '../../hooks/useArchiveDownloader.tsuseArchiveDownloader';


// ------------------------------------------------------------------
// TYPES (UPDATED)
// ------------------------------------------------------------------

interface Submission {
  _id: string;
  title: string;
  academicYear: string;
  status: 'Completed' | 'Appeal Closed' | 'Approved';
  hasAppealed: boolean;
  archive?: {
    status: 'Not Generated' | 'In Progress' | 'Completed' | 'Failed';
    fileKey?: string;
  };
}

// ------------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------------

const ArchivesPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const { downloadArchive, isDownloading } = useArchiveDownloader();
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getMyDepartmentSubmissions();
        setSubmissions(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // ------------------------------------------------------------------
  // FILTER: ONLY COMPLETED ARCHIVES
  // ------------------------------------------------------------------

  const archivedSubmissions = useMemo(
    () =>
      submissions.filter(
        sub =>
          sub.archive?.status === 'Completed' &&
          sub.archive.fileKey &&
          ['Completed', 'Appeal Closed', 'Approved'].includes(sub.status)
      ),
    [submissions]
  );

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-DEFAULT">
        Archived Submissions
      </h1>

      <CardWhite className="p-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <Archive className="text-green-500" />
          <h2 className="text-xl font-semibold">
            Completed Archives ({archivedSubmissions.length})
          </h2>
        </div>

        {archivedSubmissions.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Academic Year
                </th>
                <th className="relative px-6 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {archivedSubmissions.map(sub => (
                <tr key={sub._id} className="hover:bg-accent">
                  <td className="px-6 py-4 font-medium">
                    {sub.title}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sub.academicYear}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() =>
                     downloadArchive(sub._id)
                      }
                      variant="primary"
                      isLoading={isDownloading}
                        className='border border-white'
                    >
                      <Download size={16} className="mr-2" />
                      Download ZIP
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Inbox size={48} className="mx-auto" />
            <p className="mt-4 font-semibold">
              No submissions have been archived yet.
            </p>
          </div>
        )}
      </CardWhite>
    </div>
  );
};

export default ArchivesPage;
