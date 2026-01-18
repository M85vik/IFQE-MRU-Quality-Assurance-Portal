// src/pages/department/DepartmentDashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDepartmentSubmissions, createNewSubmission } from '../../services/submissionService';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import Input from '../../components/shared/Input';
import Modal from '../../components/shared/Modal';
import { PlusCircle, Edit, Clock, Inbox } from 'lucide-react';

interface Submission {
  _id: string;
  title: string;
  academicYear: string;
  status: string;
}

const DepartmentDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const [newSubmissionData, setNewSubmissionData] = useState({ title: '', academicYear: '', submissionType: 'Annual' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getMyDepartmentSubmissions();
        setSubmissions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const { drafts, inProgress } = useMemo(() => {
    const drafts = submissions.filter(s => ['Draft', 'Needs Revision'].includes(s.status));
    const inProgress = submissions.filter(s => ['Under Review', 'Pending Final Approval', 'Appeal Submitted'].includes(s.status));
    return { drafts, inProgress };
  }, [submissions]);

  const handleConfirmCreateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setModalError('');
    try {
      const newSubmission = await createNewSubmission(newSubmissionData);
      setIsCreateModalOpen(false);
      navigate(`/app/department/submission/${newSubmission._id}`);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-DEFAULT">Dashboard</h1>
            <p className="mt-1 text-slate-900">Manage your active and in-progress submissions.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}><PlusCircle size={20} className="mr-2" /> New Submission</Button>
        </div>

        <Card className="p-0">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3"><Edit className="text-yellow-500" /> <h2 className="text-xl font-semibold">Drafts & Revisions ({drafts.length})</h2></div>
          {drafts.length > 0 ? (
            <table className="min-w-full"><thead className="bg-secondary/50"><tr><th className="px-6 py-3 text-left text-xs uppercase">Title</th><th className="px-6 py-3 text-left text-xs uppercase">Status</th><th className="relative px-6 py-3"></th></tr></thead>
              <tbody className="divide-y divide-border">{drafts.map(sub => (<tr key={sub._id} className="hover:bg-accent"><td className="px-6 py-4 font-medium">{sub.title}</td><td className="px-6 py-4 text-sm">{sub.status}</td><td className="px-6 py-4 text-right"><Button onClick={() => navigate(`/app/department/submission/${sub._id}`)} variant="outline"><Edit size={16} className="mr-2" /> Edit</Button></td></tr>))}</tbody></table>
          ) : <p className="text-center text-muted-foreground py-8">No drafts or revisions pending.</p>}
        </Card>

        <Card className="p-0">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3"><Clock className="text-blue-500" /> <h2 className="text-xl font-semibold">In Progress ({inProgress.length})</h2></div>
          {inProgress.length > 0 ? (
            <table className="min-w-full"><thead className="bg-secondary/50"><tr><th className="px-6 py-3 text-left text-xs uppercase">Title</th><th className="px-6 py-3 text-left text-xs uppercase">Status</th></tr></thead>
              <tbody className="divide-y divide-border">{inProgress.map(sub => (<tr key={sub._id} className="hover:bg-accent"><td className="px-6 py-4 font-medium">{sub.title}</td><td className="px-6 py-4 text-sm">{sub.status}</td></tr>))}</tbody></table>
          ) : <p className="text-center text-muted-foreground py-8">No submissions are currently under review.</p>}
        </Card>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Submission">
        <form onSubmit={handleConfirmCreateSubmission} className="space-y-4  ">
          {modalError && <Alert message={modalError} type="error" />}
          <Input id="title" name="title" label="Submission Title" value={newSubmissionData.title} onChange={(e) => setNewSubmissionData({ ...newSubmissionData, title: e.target.value })} required />
          {/* <Input placeholder='e.g. 2024-2025' id="academicYear" name="academicYear" label="Academic Year" value={newSubmissionData.academicYear} onChange={(e) => setNewSubmissionData({ ...newSubmissionData, academicYear: e.target.value })} required /> */}

          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-white mb-1">
              Academic Year
            </label>
            <select
              id="academicYear"
              name="academicYear"
              className="w-full p-2 border border-input bg-card rounded-md text-black"
              value={newSubmissionData.academicYear}
              onChange={(e) => setNewSubmissionData({ ...newSubmissionData, academicYear: e.target.value })}
              required
            >
              <option value="">Select Year</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
            </select>
          </div>


          <div>
            <label htmlFor="submissionType" className="block text-sm font-medium text-white mb-1">Type</label>
            <select id="submissionType" name="submissionType" className=" text-black w-full p-2 border border-input bg-card rounded-md" value={newSubmissionData.submissionType} onChange={(e) => setNewSubmissionData({ ...newSubmissionData, submissionType: e.target.value })} >
              <option>Annual</option>
              <option>Mid-term</option>
              <option>Special</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Create Draft</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DepartmentDashboard;