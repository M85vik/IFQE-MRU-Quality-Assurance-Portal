import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

 const handleRequestDelete = (submission: Submission) => {
    setTargetSubmission(submission);
    setConfirmation('');
    setShowConfirmDialog(true);
  };

  // ✅ Called when confirmed from dialog
  const handleConfirmDelete = async () => {
    if (!targetSubmission) return;
    if (confirmation !== targetSubmission.title) {
      toast.error('Entered title does not match. Deletion cancelled.');
      return;
    }

    try {
      await apiClient.delete(`/submissions/${targetSubmission._id}`);
      toast.success('Submission deleted successfully!');
      setSubmissions((prev) => prev.filter((s) => s._id !== targetSubmission._id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete submission.');
    } finally {
      setShowConfirmDialog(false);
      setTargetSubmission(null);
      setConfirmation('');
    }
  };


  const renderTable = () => {
    if (isLoading) return <div className="p-6"><Spinner /></div>;
    if (error) return <Alert message={error} type="error" />;
    if (submissions.length === 0) return <p className="p-6 text-white">No submissions for {selectedYear}.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-[#FA8112]  text-black font-bold">
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
                     onClick={() => handleRequestDelete(sub)} 
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
        <h1 className="text-2xl font-bold text-w flex items-center gap-2">
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

      <Card className="p-0 bg-[#37353E]">
        <div className="px-6 py-4 border-b border-border bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold">Submissions ({selectedYear})</h2>
          <p className="text-base text-slate-900">Permanently delete submissions and all S3 files.</p>
        </div>
        {renderTable()}
      </Card>

     
       <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Permanent Deletion"
        message={
          <>
            <p>
              You are about to <strong className="text-red-600">permanently delete</strong> the
              submission:
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {targetSubmission?.title}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Type the exact title below to confirm:
            </p>
            <input
              className="w-full mt-2 border p-2 rounded-md"
              placeholder="Enter submission title"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </>
        }
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirmDialog(false);
          setTargetSubmission(null);
          setConfirmation('');
        }}
      />
    </div>
  );
};

export default DeletionPanel;
