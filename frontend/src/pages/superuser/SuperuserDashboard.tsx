import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuperuserQueue } from '../../services/superuserService';
import CardWhite from '../../components/shared/CardWhite';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import { FileCheck2, AlertCircle } from 'lucide-react';

interface Submission {
    _id: string;
    title: string;
    academicYear: string;
    status: 'Pending Final Approval' | 'Appeal Submitted';
    school: { name: string };
    department: { name: string };
}

interface SuperuserDashboardProps {
  queueType: 'approval' | 'appeal';
}

const SuperuserDashboard: React.FC<SuperuserDashboardProps> = ({ queueType }) => {

  const [queue, setQueue] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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

  const filteredItems = queue.filter(s => 
    queueType === 'approval' 
      ? s.status === 'Pending Final Approval' 
      : s.status === 'Appeal Submitted'
  );

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
              <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map((sub) => (
              <tr key={sub._id} className="hover:bg-accent">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{sub.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sub.school?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{sub.department?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button onClick={() => navigate(`/app/superuser/review/${sub._id}`)}   className='border border-white'>
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
    </div>
  );
};

export default SuperuserDashboard;