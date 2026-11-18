import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuperuserQueue } from '../../services/superuserService';
import { getLiveScorecardReport } from '../../services/adminService';
import CardWhite from '../../components/shared/CardWhite';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import SchoolCriteriaScorecard, { SchoolScorecardData } from '../../components/shared/SchoolCriteriaScorecard';
import { FileCheck2, AlertCircle, CheckCircle, Award } from 'lucide-react';

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    status: 'Pending Final Approval' | 'Appeal Submitted' | 'Completed' | 'Appeal Closed';
    school: { name: string };
    department: { name: string };
}

interface SuperuserDashboardProps {
  queueType: 'approval' | 'appeal' | 'completed';
}

const SuperuserDashboard: React.FC<SuperuserDashboardProps> = ({ queueType }) => {

  const [queue, setQueue] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [scorecards, setScorecards] = useState<SchoolScorecardData[]>([]);
  const [isScorecardLoading, setIsScorecardLoading] = useState(false);
  const [scorecardError, setScorecardError] = useState('');
  const [scorecardYear, setScorecardYear] = useState('2024-2025');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueue = async () => {
      setIsLoading(true);
      try {
        const data = await getSuperuserQueue();
        setQueue(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueue();
  }, []);

  useEffect(() => {
    const fetchScorecards = async () => {
      setIsScorecardLoading(true);
      setScorecardError('');
      try {
        const res = await getLiveScorecardReport(scorecardYear);
        setScorecards(res.schools || []);
      } catch (err: any) {
        setScorecardError(err.message || 'Failed to load live scorecards');
      } finally {
        setIsScorecardLoading(false);
      }
    };
    fetchScorecards();
  }, [scorecardYear]);

  const filteredItems = queue.filter(s => {
    if (queueType === 'approval') return s.status === 'Pending Final Approval';
    if (queueType === 'appeal') return s.status === 'Appeal Submitted';
    if (queueType === 'completed') return ['Completed', 'Appeal Closed'].includes(s.status);
    return false;
  });

  const pageConfig = {
    approval: {
      title: 'Submissions for Final Approval',
      icon: <FileCheck2 className="text-blue-500" />,
      buttonText: 'Finalize Review'
    },
    appeal: {
      title: 'Appeals to Review',
      icon: <AlertCircle className="text-orange-500" />,
      buttonText: 'Review Appeal'
    },
    completed: {
      title: 'Completed Submissions (View Only)',
      icon: <CheckCircle className="text-green-500" />,
      buttonText: 'View Submission'
    }
  };

  const currentConfig = pageConfig[queueType];

  const renderTable = () => {
    if (filteredItems.length === 0) {
      return <p className="text-center text-muted-foreground py-8">This queue is empty.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Department</th>
              {queueType === 'completed' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase">Status</th>
              )}
              <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map((sub) => (
              <tr key={sub._id} className="hover:bg-accent">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{sub.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sub.school?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sub.department?.name}</td>
                {queueType === 'completed' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                      {sub.status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button onClick={() => navigate(`/app/superuser/review/${sub._id}`)} className='border border-white'>
                    {currentConfig.buttonText}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="space-y-8">
      <h1
  className="text-3xl font-bold"
  style={queueType === 'approval' ? { color: '#083D77' } : {}}
>
  {currentConfig.title}
</h1>

      <CardWhite className="p-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          {currentConfig.icon}
          <h2 className="text-xl font-semibold text-card-foreground">Queue ({filteredItems.length})</h2>
        </div>
        {renderTable()}
      </CardWhite>

      {/* Current Marks Status Scorecards Section */}
      <CardWhite className="p-0">
        <div className="px-6 py-4 border-b border-border flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Award className="text-[#FA8112]" size={22} />
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Current Marks Status Scorecard</h2>
              <p className="text-xs text-muted-foreground">
                Live criteria marks status & grades across submission, reviewer, superuser, and final stages.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-muted-foreground">AY:</label>
            <select
              value={scorecardYear}
              onChange={(e) => setScorecardYear(e.target.value)}
              className="p-1.5 border border-input bg-card rounded-md text-sm text-foreground"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {isScorecardLoading && <Spinner size="md" />}
          {scorecardError && <Alert message={scorecardError} type="error" />}

          {!isScorecardLoading && !scorecardError && scorecards.length === 0 && (
            <p className="text-center text-muted-foreground py-6">
              No submission criteria data found for academic year {scorecardYear}.
            </p>
          )}

          {!isScorecardLoading && !scorecardError && scorecards.length > 0 && (
            <div className="space-y-6">
              {scorecards.length > 1 && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-foreground">Filter School:</label>
                  <select
                    value={selectedSchoolFilter}
                    onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                    className="p-2 border border-input bg-card rounded-md text-sm text-foreground"
                  >
                    <option value="all">All Schools ({scorecards.length})</option>
                    {scorecards.map((s) => (
                      <option key={s.schoolId} value={s.schoolId}>
                        {s.schoolName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-6">
                {(selectedSchoolFilter === 'all'
                  ? scorecards
                  : scorecards.filter((s) => s.schoolId === selectedSchoolFilter)
                ).map((school, idx) => (
                  <SchoolCriteriaScorecard
                    key={school.schoolId}
                    school={school}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardWhite>
    </div>
  );
};

export default SuperuserDashboard;