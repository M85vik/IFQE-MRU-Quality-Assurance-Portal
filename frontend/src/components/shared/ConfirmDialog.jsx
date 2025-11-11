import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

/**
 * A reusable, modern confirmation dialog.
 * Replaces window.confirm() with a themed modal.
 *
 * Props:
 * - isOpen: boolean → controls visibility
 * - title: string → modal title
 * - message: string → main message body
 * - confirmLabel: string → text for confirm button
 * - cancelLabel: string → text for cancel button
 * - onConfirm: function → callback when confirm clicked
 * - onCancel: function → callback when cancel clicked
 */
const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-1" size={22} />
        <p className="text-foreground/80 leading-relaxed">{message}</p>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
