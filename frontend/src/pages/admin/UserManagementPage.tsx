

import React, { useState, useEffect } from 'react';
import { registerUser } from '../../services/authService';
import apiClient from '../../api/axiosConfig';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import Alert from '../../components/shared/Alert';
import Modal from '../../components/shared/Modal';
import { UserPlus, Users, Trash2, Copy, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import UpdatePasswordDialog from '../../components/shared/UpdatePasswordDialog';

const UserManagementPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('department');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const [schools, setSchools] = useState<{ _id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [pageError, setPageError] = useState('');
  const [modalError, setModalError] = useState('');
  const [success, setSuccess] = useState('');
  const [CopySuccess, setCopySuccess] = useState('');
  const [CopyError, setCopyError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    targetId: '',
  });

  const [passwordDialog, setPasswordDialog] = useState({
  isOpen: false,
  userId: '',
  userName: '',
});


  // --- Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data } = await apiClient.get('/public/schools');
        setSchools(data);
      } catch (err) {
        setPageError('Could not load school data from the server.');
      }
    };
    fetchSchools();
  }, []);

  // --- Fetch departments when school selected
  useEffect(() => {
    // Don't run if no school is selected yet
    if (!selectedSchool) {
      setDepartments([]);
      setSelectedDepartment('');
      return;
    }

    const fetchDepartments = async () => {
      try {
        setPageError('');
        setDepartments([]); // clear old ones
        setSelectedDepartment('');
        const { data } = await apiClient.get(`/public/departments/${selectedSchool}`);
        setDepartments(data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setPageError('Could not load department data from the server.');
      }
    };

    fetchDepartments();
  }, [selectedSchool]);

  // --- Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await apiClient.get('/users/all-users');
      setUsers(data);
    } catch (err) {
      setPageError('Could not fetch users list.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Create new user
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

    if (!selectedSchool || !selectedDepartment) {
      setModalError('Please select both School and Department for this user.');
      setIsProcessing(false);
      return;
    }
    const userData: any = {
      name, email, password, role, school: selectedSchool,
      department: selectedDepartment,
    };

    try {
      await registerUser(userData);
      setSuccess(`Successfully created user: ${name} (${role}).`);
      setTimeout(() => setSuccess(''), 1500);
      resetForm();
      fetchUsers(); // refresh list
    } catch (err: any) {
      setModalError(err.message || 'Failed to create user.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Update user role
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await apiClient.put(`/users/update-role/${id}`, { role: newRole });
      toast.success('User Role Changed Successfully!');
      fetchUsers();
    } catch {
      setPageError('Failed to update user role.');
    }
  };

  // --- Delete user
  const handleDelete = (id: string) => {
    setConfirmDialog({ isOpen: true, targetId: id });
  };

  // --- Confirm deletion
  const confirmDelete = async () => {
    const { targetId } = confirmDialog;
    setConfirmDialog({ isOpen: false, targetId: '' });
    try {
      const toastId = toast.loading('Deleting user...');
      await apiClient.delete(`/users/${targetId}`);
      toast.success('User Deleted Successfully!', { id: toastId });
      await fetchUsers();
    } catch {
      setPageError('Failed to delete user.');
      toast.error('Failed to delete user.');
    }
  };


    // ---------------- Update Password ----------------
  const handlePasswordUpdate = async (masterKey: string, newPassword: string) => {
    const toastId = toast.loading('Updating password...');

try {
      await apiClient.post(
        `/users/update-password/${passwordDialog.userId}`,
        { masterKey, password: newPassword }
      );
  
      toast.success('Password updated successfully!', { id: toastId });
} catch (error) {

  toast.error("Password Change Failed");
  
}
  };


  const handleCopyAll = () => {
    if (!users.length) {
      setCopyError("No users to copy.");

      { CopyError && <Alert message={CopyError} type="error" /> }

      setTimeout(() => setCopySuccess(''), 3000);
      return;
    }

    // Create a text version of your users list
    const header = "Name\tEmail\tRole\n";
    const rows = users
      .map((u) => `${u.name}\t${u.email}\t${u.role}`)
      .join("\n");
    const textToCopy = header + rows;

    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess('User details copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
        // alert("User details copied to clipboard!")
      })
      .catch(() => {
        setCopyError("Failed to copy user details.");

        { CopyError && <Alert message={CopyError} type="error" /> }

        setTimeout(() => setCopySuccess(''), 3000);

        // alert("Failed to copy user details.")
      }
      );
  };


  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold" style={{ color: '#222222' }}>
          User Management
        </h1>

        {/* ---------------- Create User Section ---------------- */}
        <Card className="p-0  bg-[#37353E]">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold  flex items-center gap-3 text-white">
              <UserPlus size={22} /> Create New Portal User
            </h2>
          </div>
          <div className="p-6">
            {pageError && <Alert message={pageError} type="error" />}
            {success && <Alert message={success} type="success" />}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-white">
              <Input id="name" label="Full Name" type="text" value={name}  onChange={(e) => setName(e.target.value)} required />
              <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white mb-1">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 text-black border border-input bg-card rounded-md focus:ring-ring focus:border-ring">
                  <option value="department">Department User</option>
                  <option value="qaa">QAA Reviewer</option>
                  <option value="superuser">Superuser</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                </select>
              </div>



              <div className="md:col-span-2"></div>
              <div>
                <label htmlFor="school" className="block text-sm font-medium  mb-1 text-white">School</label>
                <select id="school" value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} required className="w-full px-3 py-2 border border-input bg-card rounded-md focus:ring-ring focus:border-ring">
                  <option value=""  className='text-black'  disabled>Select a school...</option>
                  {schools.map(s => <option className='text-black' key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium  mb-1">Department</label>
                <select id="department" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} required disabled={!selectedSchool || departments.length === 0} className=" text-black w-full px-3 py-2 border border-input bg-card rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:ring-ring focus:border-ring">
                  <option value="" className='text-black' disabled>Select a department...</option>
                  {departments.map(d => <option  className='text-black' key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 text-right">
                <Button  className='hover:bg-[#FAF3E1] hover:text-[#222222]  border-[#37353E] border-2 hover:border-[#FA8112] ' type="submit" isLoading={isProcessing}>Create User</Button>
              </div>
            </form>
          </div>
        </Card>

        {/* ---------------- All Users Section ---------------- */}
        <Card className="p-0 bg-[#37353E]">
          {CopySuccess && <Alert message={CopySuccess} type="success" />}
          {CopyError && <Alert message={CopyError} type="error" />}
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <Users size={22} color='white' />
            <h2 className="text-xl font-semibold text-white flex-1">All Users</h2>
            <Button onClick={handleCopyAll} className="flex items-center gap-2 hover:bg-[#FAF3E1] hover:text-[#222222]  border-[#37353E] border-2 hover:border-[#FA8112] ">
              <Copy size={16} /> Copy All
            </Button>
          </div>
          <div className="p-6 overflow-x-auto text-white">
            <table className="min-w-full border border-gray-200 text-sm ">
              <thead className=" text-left bg-[#FA8112] text-black">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {users.map((u) => (
                  <tr key={u._id} className='text-black '>
                    <td className="px-4 py-2 border">{u.name}</td>
                    <td className="px-4 py-2 border">{u.email}</td>


                    <td className="px-4 py-2 border">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}

                        className="border border-input rounded-md px-2 py-1"
                      >
                        <option value="department">department</option>
                        <option value="qaa">qaa</option>
                        <option value="superuser">superuser</option>
                        <option value="admin">admin</option>
                        <option value="developer">Developer</option>
                      </select>
                    </td>

                    {/* <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td> */}

                    <td className="px-4 py-2 border text-center">
                      <div className="flex items-center justify-evenly gap-3">
                        {/* 🔑 Change Password */}
                        <button
                          onClick={() =>
                            setPasswordDialog({
                              isOpen: true,
                              userId: u._id,
                              userName: u.name,
                            })
                          }
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Change Password"
                        >
                          <KeyRound size={18} />
                        </button>

                        {/* 🗑 Delete User */}
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, targetId: '' })}
        />
      </div>

      {/* --- Error Modal --- */}
      <Modal isOpen={!!modalError} onClose={() => setModalError('')} title="Could Not Create User">
        <Alert message={modalError} type="error" />
        <div className="text-right mt-4">
          <Button onClick={() => setModalError('')}>Close</Button>
        </div>
      </Modal>

      <UpdatePasswordDialog
  isOpen={passwordDialog.isOpen}
  userName={passwordDialog.userName}
  onClose={() =>
    setPasswordDialog({ isOpen: false, userId: '', userName: '' })
  }
  onSubmit={handlePasswordUpdate}
/>

    </>
  );
};

export default UserManagementPage;

