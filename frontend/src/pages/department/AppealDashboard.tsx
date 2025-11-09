// // src/pages/department/AppealDashboard.tsx

// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getMyDepartmentSubmissions } from '../../services/submissionService';
// import Card from '../../components/shared/Card';
// import Button from '../../components/shared/Button';
// import Spinner from '../../components/shared/Spinner';
// import { AlertCircle, Inbox } from 'lucide-react';

// interface Submission {
//   _id: string;
//   title: string;
//   academicYear: string;
//   status: 'Completed';
//   hasAppealed: boolean;
// }

// const AppealDashboard: React.FC = () => {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

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

//   const appealableSubmissions = useMemo(() => 
//     submissions.filter(sub => sub.status === 'Completed' && !sub.hasAppealed), 
//     [submissions]
//   );

//   if (isLoading) return <Spinner size="lg" />;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-primary-DEFAULT">Appealable Submissions</h1>
//       <Card className="p-0">
//         <div className="px-6 py-4 border-b border-border flex items-center gap-3">
//             <AlertCircle className="text-orange-500" />
//             <h2 className="text-xl font-semibold">Ready for Appeal ({appealableSubmissions.length})</h2>
//         </div>
//         {appealableSubmissions.length > 0 ? (
//             <div className="overflow-x-auto">
//                 <table className="min-w-full"><thead className="bg-secondary/50"><tr><th className="px-6 py-3 text-left text-xs uppercase">Title</th><th className="px-6 py-3 text-left text-xs uppercase">Academic Year</th><th className="relative px-6 py-3"></th></tr></thead>
//                 <tbody className="divide-y divide-border">{appealableSubmissions.map(sub => (<tr key={sub._id} className="hover:bg-accent"><td className="px-6 py-4 font-medium">{sub.title}</td><td className="px-6 py-4 text-sm">{sub.academicYear}</td><td className="px-6 py-4 text-right"><Button onClick={() => navigate(`/app/department/appeal/${sub._id}`)}><AlertCircle size={16} className="mr-2"/> Start Appeal</Button></td></tr>))}</tbody></table>
//             </div>
//         ) : <div className="text-center py-16 text-muted-foreground"><Inbox size={48} className="mx-auto"/><p className="mt-4 font-semibold">No submissions are currently eligible for appeal.</p></div>}
//       </Card>
//     </div>
//   );
// };

// export default AppealDashboard;



// src/pages/department/AppealDashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDepartmentSubmissions } from '../../services/submissionService';
import { getCurrentWindow } from "../../services/submissionWindowService"
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import { AlertCircle, Inbox } from 'lucide-react';

interface Submission {
  _id: string;
  title: string;
  academicYear: string;
  status: 'Completed';
  hasAppealed: boolean;
}

interface SubmissionWindow {
  _id: string;
  academicYear: string;
  windowType: 'Submission' | 'Appeal';
  startDate: string;
  endDate: string;
}


const AppealDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subs, window] = await Promise.all([
          getMyDepartmentSubmissions(),
          getCurrentWindow()
        ]);

        if (window) {
          const filtered = subs.filter((s: Submission) =>
            s.status === 'Completed' &&
            !s.hasAppealed &&
            s.academicYear === window.academicYear
          );
          setSubmissions(filtered);
        } else {
          setSubmissions([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-DEFAULT">Appealable Submissions</h1>
      <Card className="p-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <AlertCircle className="text-orange-500" />
          <h2 className="text-xl font-semibold">
            Ready for Appeal ({submissions.length})
          </h2>
        </div>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Academic Year</th>
                  <th className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-accent">
                    <td className="px-6 py-4 font-medium">{sub.title}</td>
                    <td className="px-6 py-4 text-sm">{sub.academicYear}</td>
                    <td className="px-6 py-4 text-right">
                      <Button onClick={() => navigate(`/app/department/appeal/${sub._id}`)}>
                        <AlertCircle size={16} className="mr-2" /> Start Appeal
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Inbox size={48} className="mx-auto" />
            <p className="mt-4 font-semibold">
              No submissions are currently eligible for appeal.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};


export default AppealDashboard;
