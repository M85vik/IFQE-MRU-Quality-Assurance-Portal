import React, { useEffect, useState, useCallback, useRef } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Alert from '../../components/shared/Alert';
import { Archive, AlertTriangle, Download, FolderTree, Loader2 } from 'lucide-react';
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

interface MasterArchiveStatus {
  academicYear: string;
  status: 'Not Generated' | 'In Progress' | 'Completed' | 'Failed';
  fileKey: string | null;
  submissionCount: number;
  fileCount: number;
  zipSizeMB: number;
  generatedAt: string | null;
  error: string | null;
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

  // Master archive state
  const [masterStatus, setMasterStatus] = useState<MasterArchiveStatus | null>(null);
  const [isMasterLoading, setIsMasterLoading] = useState(false);
  const [showMasterConfirm, setShowMasterConfirm] = useState(false);
  const masterPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableYears = ['2025-2026', '2024-2025', '2023-2024'];

  // ------------------------------------------------------------------
  // FETCH — Per-Department Submissions
  // ------------------------------------------------------------------

  useEffect(() => {
    fetchSubmissions();
    fetchMasterStatus();
    return () => {
      if (masterPollRef.current) clearInterval(masterPollRef.current);
    };
  }, [selectedYear]);

  // Auto-poll if any per-department archive is in progress
  useEffect(() => {
    const hasRunningJob = submissions.some(
      s => s.archive?.status === 'In Progress'
    );

    if (!hasRunningJob) return;

    const interval = setInterval(fetchSubmissions, 5000);
    return () => clearInterval(interval);
  }, [submissions]);

  // Auto-poll master archive when in progress
  useEffect(() => {
    if (masterPollRef.current) {
      clearInterval(masterPollRef.current);
      masterPollRef.current = null;
    }

    if (masterStatus?.status === 'In Progress') {
      masterPollRef.current = setInterval(fetchMasterStatus, 5000);
    }

    return () => {
      if (masterPollRef.current) clearInterval(masterPollRef.current);
    };
  }, [masterStatus?.status]);

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
  // FETCH — Master Archive Status
  // ------------------------------------------------------------------

  const fetchMasterStatus = useCallback(async () => {
    try {
      const { data } = await apiClient.get(
        `/archives/master/${selectedYear}/status`
      );
      setMasterStatus(data);
    } catch (err) {
      console.warn('Failed to fetch master archive status');
    }
  }, [selectedYear]);

  // ------------------------------------------------------------------
  // MASTER ARCHIVE ACTIONS
  // ------------------------------------------------------------------

  const handleGenerateMaster = async () => {
    setShowMasterConfirm(false);
    setIsMasterLoading(true);
    try {
      await apiClient.post(`/archives/master/${selectedYear}`);
      toast.success('Master archive generation started.');
      // Immediately set status to In Progress for UI responsiveness
      setMasterStatus(prev => prev ? { ...prev, status: 'In Progress' } : {
        academicYear: selectedYear,
        status: 'In Progress',
        fileKey: null,
        submissionCount: 0,
        fileCount: 0,
        zipSizeMB: 0,
        generatedAt: null,
        error: null,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start master archive.');
    } finally {
      setIsMasterLoading(false);
    }
  };

  const handleDownloadMaster = async () => {
    try {
      const { data } = await apiClient.get(
        `/archives/master/${selectedYear}/download`
      );
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to download master archive.');
    }
  };

  // ------------------------------------------------------------------
  // PER-DEPARTMENT ARCHIVE ACTIONS
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

  const renderMasterStatusBadge = () => {
    const status = masterStatus?.status || 'Not Generated';

    const badgeStyles: Record<string, { bg: string; text: string; label: string }> = {
      'Not Generated': { bg: 'bg-gray-200', text: 'text-gray-700', label: 'Not Generated' },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: '⏳ Generating…' },
      'Completed': { bg: 'bg-green-100', text: 'text-green-700', label: '✅ Ready' },
      'Failed': { bg: 'bg-red-100', text: 'text-red-700', label: '❌ Failed' },
    };

    const s = badgeStyles[status] || badgeStyles['Not Generated'];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>
        {status === 'In Progress' && <Loader2 size={14} className="mr-1 animate-spin" />}
        {s.label}
      </span>
    );
  };

  // ------------------------------------------------------------------
  // TABLE — Per-Department
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

      {/* ============================================================ */}
      {/* MASTER ARCHIVE — By Indicator Code */}
      {/* ============================================================ */}
      <Card className="p-0 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#FA8112]/30">
        <div className="px-6 py-4 border-b border-[#FA8112]/20 bg-gradient-to-r from-[#FA8112]/10 to-transparent rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FA8112]/20 rounded-lg">
                <FolderTree size={24} className="text-[#FA8112]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Master Archive — By Indicator Code
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  All departments grouped by indicator (1.1.1, 1.1.2, etc.) for easy comparison
                </p>
              </div>
            </div>
            {renderMasterStatusBadge()}
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Status details */}
          {masterStatus?.status === 'Completed' && (
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Departments</p>
                <p className="text-lg font-bold text-white">{masterStatus.submissionCount}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Files</p>
                <p className="text-lg font-bold text-white">{masterStatus.fileCount}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wide">ZIP Size</p>
                <p className="text-lg font-bold text-white">{masterStatus.zipSizeMB} MB</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Generated</p>
                <p className="text-sm font-medium text-white">
                  {masterStatus.generatedAt ? new Date(masterStatus.generatedAt).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
          )}

          {masterStatus?.status === 'Failed' && masterStatus.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              Error: {masterStatus.error}
            </div>
          )}

          {masterStatus?.status === 'In Progress' && (
            <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Generating master archive… This may take a few minutes depending on the number of files.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="border border-[#FA8112]"
              disabled={masterStatus?.status === 'In Progress' || isMasterLoading}
              onClick={() => setShowMasterConfirm(true)}
            >
              <Archive size={16} className="mr-2" />
              {masterStatus?.status === 'In Progress'
                ? 'Generating…'
                : masterStatus?.status === 'Completed'
                  ? 'Regenerate Master Archive'
                  : masterStatus?.status === 'Failed'
                    ? 'Retry Master Archive'
                    : 'Generate Master Archive'}
            </Button>

            {masterStatus?.status === 'Completed' && (
              <Button
                variant="primary"
                className="bg-green-600 hover:bg-green-700 border border-green-400"
                onClick={handleDownloadMaster}
              >
                <Download size={16} className="mr-2" />
                Download Master Archive
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* PER-DEPARTMENT ARCHIVE — Existing */}
      {/* ============================================================ */}
      <Card className="p-0 bg-[#37353E]">
        <div className="px-6 py-4 border-b bg-white rounded-t-lg">
          <h2 className="text-xl font-semibold">
            Per-Department Archives ({selectedYear})
          </h2>
          <p className="text-slate-900">
            Generate and manage individual department submission archives.
          </p>
        </div>
        {renderTable()}
      </Card>

      {/* Per-department confirm dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Archive Generation"
        message={
          <>
            <p>You are about to generate an archive for:</p>
            <p className="mt-2 font-semibold text-lg">
              {targetSubmission?.title}
            </p>
            <p className="mt-2 text-sm text-amber-500">
              This may take some time. Check status letter.
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

      {/* Master archive confirm dialog */}
      <ConfirmDialog
        isOpen={showMasterConfirm}
        title="Generate Master Archive"
        message={
          <>
            <p>You are about to generate a <strong>Master Archive</strong> for <strong>{selectedYear}</strong>.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This will collect files from <strong>all approved department submissions</strong> and organize them by indicator code (1.1.1, 1.1.2, etc.).
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This may take several minutes depending on the total number of files.
            </p>
          </>
        }
        confirmLabel="Generate Master Archive"
        cancelLabel="Cancel"
        onConfirm={handleGenerateMaster}
        onCancel={() => setShowMasterConfirm(false)}
      />
    </div>
  );
};

export default ArchivingPanel;




