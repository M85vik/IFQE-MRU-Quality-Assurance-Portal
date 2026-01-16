import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Alert from './Alert';

interface UpdatePasswordDialogProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onSubmit: (masterKey: string, newPassword: string) => Promise<void>;
}

const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({
  isOpen,
  userName,
  onClose,
  onSubmit,
}) => {
  const [masterKey, setMasterKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');

    if (!masterKey || !password) {
      setError('Master key and new password are required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(masterKey, password);
      setMasterKey('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reset Password for ${userName}`}
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} />}

        <Input
         id="masterKey"
          label="Master Key"
          type="password"
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
        />

        <Input
         id="newPassword"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Update Password
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdatePasswordDialog;
