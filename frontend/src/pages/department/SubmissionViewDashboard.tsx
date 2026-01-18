import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDepartmentSubmissions } from '../../services/submissionService';

import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import { FileText, Inbox } from 'lucide-react';

interface Submission {
  _id: string;
  title: string;
  academicYear: string;
  status: 'Completed' | 'Appeal Closed' | 'Approved';
}

const SubmissionViewDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getMyDepartmentSubmissions();

        // Only submissions that have been evaluated
        const filtered = data.filter(
          (s: Submission) =>
            ['Completed', 'Appeal Closed', 'Approved'].includes(s.status)
        );

        setSubmissions(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-DEFAULT">
        Submission Reviews
      </h1>

      <Card className="p-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <FileText className="text-blue-600" />
          <h2 className="text-xl font-semibold">
            Reviewed Submissions ({submissions.length})
          </h2>
        </div>

        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    Academic Year
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {submissions.map(sub => (
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
                          navigate(
                            `/app/department/submission-view/${sub._id}`
                          )
                        }
                        variant="primary"
                          className='border border-white'
                      >
                        <FileText size={16} className="mr-2" />
                        View Remarks
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
              No reviewed submissions available yet.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SubmissionViewDashboard;
