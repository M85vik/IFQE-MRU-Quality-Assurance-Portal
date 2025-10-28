import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4"
      onClick={onClose} 
    >
      
      <div
        className="relative bg-card rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg text-sm p-1.5"
          >
            <X size={24} />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;