import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import { Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Submission {
  _id: string;
  title: string;
  school: { name: string };
  department: { name: string };
  academicYear: string;
  status: string;
}

const DeletionPanel: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [targetSubmission, setTargetSubmission] = useState<Submission | null>(null);

  const availableYears = ['2025-2026', '2024-2025', '2023-2024'];

  useEffect(() => {
    fetchSubmissions();
  }, [selectedYear]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get(`/submissions/approved?academicYear=${selectedYear}`);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetSubmission) return;
    if (confirmation !== targetSubmission.title) {
      // alert('Entered name does not match. Deletion cancelled.');
      toast('Entered name does not match. Deletion cancelled.', { icon: '⚠️' });

      return;
    }

    if (!window.confirm('This will permanently delete this submission and all related files. Continue?')) return;

    try {
      await apiClient.delete(`/submissions/${targetSubmission._id}`);
      // alert('Submission deleted successfully.');
         toast.success('Submission Deleted Successfully!');
      setSubmissions(submissions.filter(s => s._id !== targetSubmission._id));
      setTargetSubmission(null);
      setConfirmation('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete submission.');
    }
  };

  const renderTable = () => {
    if (isLoading) return <div className="p-6"><Spinner /></div>;
    if (error) return <Alert message={error} type="error" />;
    if (submissions.length === 0) return <p className="p-6 text-muted-foreground">No submissions for {selectedYear}.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">School</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {submissions.map(sub => (
              <tr key={sub._id} className="hover:bg-accent">
                <td className="px-6 py-4 text-sm font-medium">{sub.title}</td>
                <td className="px-6 py-4 text-sm">{sub.school?.name}</td>
                <td className="px-6 py-4 text-sm">{sub.department?.name}</td>
                <td className="px-6 py-4 text-sm">{sub.status}</td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => setTargetSubmission(sub)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground/90 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> Deletion Panel
        </h1>

        <select
          className="border rounded-md p-2"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <Card className="p-0">
        <div className="px-6 py-4 border-b border-border bg-muted/70 rounded-t-lg">
          <h2 className="text-xl font-semibold">Submissions ({selectedYear})</h2>
          <p className="text-base text-muted-foreground">Permanently delete submissions and all S3 files.</p>
        </div>
        {renderTable()}
      </Card>

      {targetSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-3xl w-full space-y-4">
            <h3 className="text-2xl font-semibold text-red-600">Confirm Deletion</h3>
            <p className="text-base text-muted-foreground">
              To confirm deletion of <strong>{targetSubmission.title}</strong>, type its exact title below:
            </p>
            <input
              className="w-full border p-2 rounded-md"
              placeholder="Enter submission title"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setTargetSubmission(null)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={handleDelete}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletionPanel;
