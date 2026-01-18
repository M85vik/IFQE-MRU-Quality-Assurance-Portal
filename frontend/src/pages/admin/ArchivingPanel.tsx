import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Alert from '../../components/shared/Alert';
import { Archive, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------

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
    error?: string;
  };
}

// ------------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------------

const ArchivingPanel: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [targetSubmission, setTargetSubmission] = useState<Submission | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const availableYears = ['2025-2026', '2024-2025', '2023-2024'];

  // ------------------------------------------------------------------
  // FETCH
  // ------------------------------------------------------------------

  useEffect(() => {
    fetchSubmissions();
  }, [selectedYear]);

  // Auto-poll if any archive is in progress
  useEffect(() => {
    const hasRunningJob = submissions.some(
      s => s.archive?.status === 'In Progress'
    );

    if (!hasRunningJob) return;

    const interval = setInterval(fetchSubmissions, 5000);
    return () => clearInterval(interval);
  }, [submissions]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get(
        `/submissions/approved?academicYear=${selectedYear}`
      );
      setSubmissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // ARCHIVE ACTIONS
  // ------------------------------------------------------------------

  const handleRequestArchive = (submission: Submission) => {
    setTargetSubmission(submission);
    setShowConfirmDialog(true);
  };

  const handleConfirmArchive = async () => {
    if (!targetSubmission) return;

    try {
      await apiClient.post(
        `/archives/submissions/${targetSubmission._id}`
      );
      toast.success('Archive generation started.');
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate archive.');
    } finally {
      setShowConfirmDialog(false);
      setTargetSubmission(null);
    }
  };

  // ------------------------------------------------------------------
  // UI HELPERS
  // ------------------------------------------------------------------

  const renderArchiveStatus = (sub: Submission) => {
    if (!sub.archive || sub.archive.status === 'Not Generated') {
      return 'Not Archived';
    }
    if (sub.archive.status === 'In Progress') {
      return 'Archiving ⏳';
    }
    if (sub.archive.status === 'Completed') {
      return 'Archived ✅';
    }
    if (sub.archive.status === 'Failed') {
      return (
        <span className="text-red-600">
          Failed ❌
        </span>
      );
    }
    return '—';
  };

  const renderArchiveButtonLabel = (sub: Submission) => {
    if (!sub.archive || sub.archive.status === 'Not Generated') {
      return 'Generate Archive';
    }
    if (sub.archive.status === 'In Progress') {
      return 'Processing…';
    }
    if (sub.archive.status === 'Completed') {
      return 'Archived';
    }
    if (sub.archive.status === 'Failed') {
      return 'Retry Archive';
    }
    return 'Generate Archive';
  };

  // ------------------------------------------------------------------
  // TABLE
  // ------------------------------------------------------------------

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="p-6">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return <Alert message={error} type="error" />;
    }

    if (submissions.length === 0) {
      return (
        <p className="p-6 text-white">
          No submissions for {selectedYear}.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-[#FA8112] text-black font-bold">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">School</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Archive</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>

          <tbody className="bg-card divide-y divide-border">
            {submissions.map(sub => (
              <tr key={sub._id} className="hover:bg-accent">
                <td className="px-6 py-4 text-sm font-medium">
                  {sub.title}
                </td>
                <td className="px-6 py-4 text-sm">
                  {sub.school?.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  {sub.department?.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  {renderArchiveStatus(sub)}
                </td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="primary"
                      className='border border-white'
                    disabled={sub.archive?.status === 'In Progress'}
                    onClick={() => handleRequestArchive(sub)}
                  >
                    <Archive size={16} className="mr-2" />
                    {renderArchiveButtonLabel(sub)}
                  </Button>
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
    <div className="space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="text-yellow-600" />
          Archiving Panel
        </h1>

        <select
          className="border rounded-md p-2"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Card className="p-0 bg-[#37353E]">
        <div className="px-6 py-4 border-b bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold">
            Submissions ({selectedYear})
          </h2>
          <p className="text-slate-900">
            Generate and manage submission archives.
          </p>
        </div>
        {renderTable()}
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Archive Generation"
        message={
          <>
            <p>You are about to generate an archive for:</p>
            <p className="mt-2 font-semibold text-lg">
              {targetSubmission?.title}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This may take time and will consume server storage.
            </p>
          </>
        }
        confirmLabel="Generate Archive"
        cancelLabel="Cancel"
        onConfirm={handleConfirmArchive}
        onCancel={() => {
          setShowConfirmDialog(false);
          setTargetSubmission(null);
        }}
      />
    </div>
  );
};

export default ArchivingPanel;
