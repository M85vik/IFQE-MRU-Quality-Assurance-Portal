// src/pages/admin/ManageContentPage.tsx

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import Spinner from '../../components/shared/Spinner';
import Alert from '../../components/shared/Alert';
import { Megaphone, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
interface Announcement {
    _id: string;
    category: string;
    title: string;
    summary: string;
    details?: string;
    date: string;
    color: 'blue' | 'red' | 'gray';
    isActive: boolean;
}

const ManageContentPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        category: 'Workshop',
        title: '',
        summary: '',
        details: '',
        date: '',
        color: 'blue',
        isActive: true,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        targetId: '',
    });
    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true);
            const { data } = await apiClient.get('/announcements');
            setAnnouncements(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {



            if (editingId) {
                await apiClient.put(`/announcements/${editingId}`, formData);
                toast.success('Announcement updated successfully!');
            } else {
                await apiClient.post('/announcements', formData);
                toast.success('Announcement created successfully!');
            }
            resetForm();

            await fetchAnnouncements();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (ann: Announcement) => {
        setEditingId(ann._id);
        setFormData({
            category: ann.category,
            title: ann.title,
            summary: ann.summary,
            details: ann.details || '',
            date: ann.date,
            color: ann.color,
            isActive: ann.isActive,
        });
        window.scrollTo(0, 0);
    };

    // const handleDelete = async (id: string) => {
    //     if (window.confirm('Are you sure you want to delete this announcement?')) {
    //         try {
    //             await apiClient.delete(`/announcements/${id}`);
    //             await fetchAnnouncements();
    //         } catch (err: any) {
    //             setError(err.response?.data?.message || 'Could not delete announcement.');
    //         }
    //     }
    // };

    const handleDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, targetId: id });
  };

  // 👇 Executes after confirmation
  const confirmDelete = async () => {
    const { targetId } = confirmDialog;
    setConfirmDialog({ isOpen: false, targetId: '' });

    try {
      const toastId = toast.loading('Deleting announcement...');
      await apiClient.delete(`/announcements/${targetId}`);
      toast.success('Announcement deleted successfully!', { id: toastId });
      await fetchAnnouncements();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Could not delete announcement.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };


    const resetForm = () => {
        setFormData({ category: 'Workshop', title: '', summary: '', details: '', date: '', color: 'blue', isActive: true });
        setEditingId(null);
        setError('');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary-DEFAULT">Homepage Content</h1>

            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-card-foreground">{editingId ? 'Edit' : 'Create'} Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="title" name="title" label="Title" value={formData.title} onChange={handleFormChange} required />
                            <Input id="date" name="date" label="Date (e.g., November 10, 2025)" value={formData.date} onChange={handleFormChange} required />
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleFormChange} className="w-full p-2 border border-input bg-background rounded-md">
                                    <option value="Workshop">Workshop</option>
                                    <option value="Deadline">Deadline</option>
                                    <option value="System Update">System Update</option>
                                    <option value="Result">Result</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="color" className="block text-sm font-medium text-muted-foreground mb-1">Color Theme</label>
                                <select id="color" name="color" value={formData.color} onChange={handleFormChange} className="w-full p-2 border border-input bg-background rounded-md">
                                    <option value="blue">Blue</option>
                                    <option value="red">Red</option>
                                    <option value="gray">Gray</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="summary" className="block text-sm font-medium text-muted-foreground mb-1">Summary</label>
                                <textarea id="summary" name="summary" value={formData.summary} onChange={handleFormChange} required rows={2} className="w-full p-2 border border-input bg-background rounded-md" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="details" className="block text-sm font-medium text-muted-foreground mb-1">Details (for hover effect)</label>
                                <textarea id="details" name="details" value={formData.details} onChange={handleFormChange} rows={3} className="w-full p-2 border border-input bg-background rounded-md" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="h-4 w-4 rounded" />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-foreground">Active on Homepage</label>
                            </div>
                            <div className="flex space-x-2">
                                <Button type="submit" isLoading={isSubmitting}>{editingId ? 'Update' : 'Create'}</Button>
                                {editingId && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
                            </div>
                        </div>
                    </form>
                    {error && <div className="mt-4"><Alert message={error} type="error" /></div>}
                </div>
            </Card>

            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-card-foreground">Existing Announcements</h2>
                    {isLoading ? <Spinner /> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-secondary/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-card divide-y divide-border">
                                    {announcements.map((ann) => (
                                        <tr key={ann._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{ann.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{ann.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ann.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {ann.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(ann)}><Edit size={14} /></Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(ann._id)} className="text-destructive border-destructive/50 hover:bg-destructive/10"><Trash2 size={14} /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>

              <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, targetId: '' })}
      />
        </div>
    );
};

export default ManageContentPage;