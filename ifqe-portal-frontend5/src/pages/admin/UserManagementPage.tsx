import React, { useState, useEffect } from 'react';
import { registerUser } from '../../services/authService';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import Alert from '../../components/shared/Alert';
import Modal from '../../components/shared/Modal';
import { UserPlus } from 'lucide-react';

const UserManagementPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('department');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    
    const [schools, setSchools] = useState<{ _id: string; name: string }[]>([]);
    const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageError, setPageError] = useState('');
    const [modalError, setModalError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const { data } = await apiClient.get('/public/schools');
                setSchools(data);
            } catch (err) {
                setPageError("Could not load school data from the server.");
            }
        };
        fetchSchools();
    }, []);

    useEffect(() => {
        if (role === 'department' && selectedSchool) {
            const fetchDepartments = async () => {
                setDepartments([]);
                setSelectedDepartment('');
                try {
                    const { data } = await apiClient.get(`/public/departments/${selectedSchool}`);
                    setDepartments(data);
                } catch (err) {
                    setPageError("Could not load department data from the server.");
                }
            };
            fetchDepartments();
        } else {
            setDepartments([]);
            setSelectedDepartment('');
        }
    }, [selectedSchool, role]);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('department');
        setSelectedSchool('');
        setSelectedDepartment('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError(''); 
        setSuccess(''); 
        setIsProcessing(true);

        const userData: any = { name, email, password, role };
        if (role === 'department') {
            if (!selectedSchool || !selectedDepartment) {
                setModalError('School and Department are required for a department user.');
                setIsProcessing(false);
                return;
            }
            userData.school = selectedSchool;
            userData.department = selectedDepartment;
        }
        
        try {
            await registerUser(userData);
            setSuccess(`Successfully created user: ${name} (${role}). An email would typically be sent to them with their credentials.`);
            resetForm();
        } catch (err: any) {
            setModalError(err.message || 'Failed to create user.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold" style={{ color: '#083D77' }}>
  User Management
</h1>

                <Card className="p-0">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-3">
                            <UserPlus size={22} /> Create New Portal User
                        </h2>
                    </div>
                    <div className="p-6">
                        {pageError && <Alert message={pageError} type="error" />}
                        {success && <Alert message={success} type="success" />}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <Input id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input id="password" label="Temporary Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-input bg-card rounded-md focus:ring-ring focus:border-ring">
                                    <option value="department">Department User</option>
                                    <option value="qaa">QAA Reviewer</option>
                                    <option value="superuser">Superuser</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {role === 'department' && (
                                <>
                                    <div className="md:col-span-2"></div> 
                                    <div>
                                        <label htmlFor="school" className="block text-sm font-medium text-muted-foreground mb-1">School</label>
                                        <select id="school" value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} required className="w-full px-3 py-2 border border-input bg-card rounded-md focus:ring-ring focus:border-ring">
                                            <option value="" disabled>Select a school...</option>
                                            {schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
                                        <select id="department" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} required disabled={!selectedSchool || departments.length === 0} className="w-full px-3 py-2 border border-input bg-card rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-ring focus:border-ring">
                                            <option value="" disabled>Select a department...</option>
                                            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="md:col-span-2 text-right">
                                <Button type="submit" isLoading={isProcessing}>Create User</Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>

            <Modal isOpen={!!modalError} onClose={() => setModalError('')} title="Could Not Create User">
                <Alert message={modalError} type="error" />
                 <div className="text-right mt-4">
                    <Button onClick={() => setModalError('')}>Close</Button>
                </div>
            </Modal>
        </>
    );
};

export default UserManagementPage;