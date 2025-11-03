// src/pages/admin/ManageWindowsPage.tsx

import React, { useState, useEffect } from 'react';
import { getSubmissionWindows, createSubmissionWindow, updateSubmissionWindow, deleteSubmissionWindow } from '../../services/submissionWindowService';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import { Edit, Trash2 } from 'lucide-react';

interface SubmissionWindow {
  _id: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  windowType: 'Submission' | 'Appeal';
}

const ManageWindowsPage: React.FC = () => {
    const [windows, setWindows] = useState<SubmissionWindow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        academicYear: '',
        startDate: '',
        endDate: '',
        windowType: 'Submission' as 'Submission' | 'Appeal',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchWindows = async () => {
        try {
            setIsLoading(true);
            const data = await getSubmissionWindows();
            setWindows(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWindows();
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (editingId) {
                await updateSubmissionWindow(editingId, formData);
            } else {
                await createSubmissionWindow(formData);
            }
            resetForm();
            await fetchWindows();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- FIX: Renamed the 'window' parameter to 'windowToEdit' to avoid conflict ---
    const handleEdit = (windowToEdit: SubmissionWindow) => {
        setEditingId(windowToEdit._id);
        setFormData({
            academicYear: windowToEdit.academicYear,
            startDate: new Date(windowToEdit.startDate).toISOString().split('T')[0],
            endDate: new Date(windowToEdit.endDate).toISOString().split('T')[0],
            windowType: windowToEdit.windowType,
        });
        // Now this correctly refers to the browser's global window object
        window.scrollTo(0, 0);
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this window?')) {
            try {
                await deleteSubmissionWindow(id);
                await fetchWindows();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Could not delete window.');
            }
        }
    };

    const resetForm = () => {
        setFormData({ academicYear: '', startDate: '', endDate: '', windowType: 'Submission' });
        setEditingId(null);
        setError('');
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary-DEFAULT">Manage Submission & Appeal Windows</h1>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Create'} Window</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input id="academicYear" name="academicYear" label="Academic Year (YYYY-YYYY)" value={formData.academicYear} onChange={handleFormChange} required />
                    <Input id="startDate" name="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleFormChange} required />
                    <Input id="endDate" name="endDate" label="End Date" type="date" value={formData.endDate} onChange={handleFormChange} required />
                    <div>
                        <label htmlFor="windowType" className="block text-sm font-medium text-muted-foreground mb-1">Window Type</label>
                        <select id="windowType" name="windowType" value={formData.windowType} onChange={handleFormChange} className="w-full p-2 border border-input bg-background rounded-md">
                            <option value="Submission">Submission</option>
                            <option value="Appeal">Appeal</option>
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <Button type="submit" isLoading={isSubmitting}>{editingId ? 'Update' : 'Create'}</Button>
                        {editingId && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
                    </div>
                </form>
                {error && <div className="mt-4"><Alert message={error} type="error" /></div>}
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Existing Windows</h2>
                {isLoading ? <Spinner /> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Academic Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Window Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Start Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">End Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {windows.length > 0 ? windows.map((win) => (
                                    <tr key={win._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{win.academicYear}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${win.windowType === 'Appeal' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {win.windowType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(win.startDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(win.endDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(win)}><Edit size={14} /></Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(win._id)} className="text-destructive border-destructive/50 hover:bg-destructive/10"><Trash2 size={14} /></Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground">No windows have been created yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
              </div>
            </Card>
        </div>
    );
};

export default ManageWindowsPage;