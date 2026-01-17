import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Alert from '../../components/shared/Alert';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import Spinner from '../../components/shared/Spinner';
import toast from 'react-hot-toast';
const STATUSES = [
  'Draft',
  'Under Review',
  'Pending Final Approval',
  'Completed',
  'Appeal Submitted',
  'Appeal Closed',
];

// ✅ Academic year options (editable)
const ACADEMIC_YEARS = [
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
];

const AdminSubmissionOverridePage = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [confirm, setConfirm] = useState<{
    submission: any;
    newStatus: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ NEW API USAGE
  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError('');
    try {
        
      const { data } = await apiClient.get(
        `/submissions/by-academic-year/${selectedYear}`
      );
      setSubmissions(data);
    
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch submissions.');
    
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedYear]);

  const requestStatusChange = (submission: any, newStatus: string) => {
    if (submission.status === newStatus) return;
    setConfirm({ submission, newStatus });
  };

  const applyStatusChange = async () => {
      if (!confirm) return;
   try {
     const toastId = toast.loading('Updating Status...');
     await apiClient.put(
       `/submissions/admin/update-status/${confirm.submission._id}`,
       {
         status: confirm.newStatus,
         reason: 'Manual admin override (danger zone)',
       }

     );


       toast.success('Update Successfull !',{id: toastId})

     setConfirm(null);
     fetchSubmissions();
   } catch (error:any) {
      toast.error(error.response?.data?.message || 'Update Failed !!')
   }
  };

  return (
    <Card className="space-y-4  ">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-red-700 mb-5">
          ⚠ Admin Submission Status Override
        </h2>

        {/* 🎓 Academic Year Selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded-md px-3 py-1 bg-white"
        >
          {ACADEMIC_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* WARNING */}
      <Alert
    
        type="error"
        message="⚠ This is a dangerous operation. Manually changing submission status can corrupt workflow history, approval integrity, and reporting data. Proceed only if you fully understand the impact."
      />

      {/* ERROR */}
      
      <br />
      {error && <Alert type="error" message={error} />}

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <table className="w-full border text-sm mt-5">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Current Status</th>
              <th className="px-4 py-2 border">Change Status</th>
            </tr>
          </thead>

          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No submissions found for selected academic year.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-2 border">{s.title}</td>
                  <td className="px-4 py-2 border">
                    {s.department?.name || 'NA'}
                  </td>
                  <td className="px-4 py-2 border font-medium">
                    {s.status}
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        requestStatusChange(s, e.target.value)
                      }
                      className="border rounded-md px-2 py-1 bg-white"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* 🚨 CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!confirm}
        title="⚠ Dangerous Admin Operation"
        message={
          <>
            <p>
              You are about to <strong>manually override</strong> the
              submission status.
            </p>
            <p className="mt-2 text-red-600 font-semibold">
              This action may corrupt workflow data and audit history.
            </p>
            <p className="mt-2">
              New Status:{' '}
              <strong>{confirm?.newStatus}</strong>
            </p>
          </>
        }
        confirmLabel="I Understand the Risk"
        cancelLabel="Cancel"
        onConfirm={applyStatusChange}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
};

export default AdminSubmissionOverridePage;
