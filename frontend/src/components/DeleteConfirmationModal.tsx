import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card p-6 max-w-md w-full mx-4 space-y-4">
        <div className="flex items-center gap-3">
          {isDangerous ? (
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          ) : (
            <Trash2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
          )}
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="ml-auto p-1 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-slate-300">{message}</p>
          {itemName && (
            <div className="bg-slate-900/50 border border-slate-700 rounded p-3">
              <p className="text-sm text-slate-400">Item to be deleted:</p>
              <p className="text-white font-semibold truncate">{itemName}</p>
            </div>
          )}
          <p className="text-sm text-slate-400">
            This action cannot be undone. The volunteer will be archived and their data will be preserved
            in the system for record-keeping purposes.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? 'Deleting...' : 'Delete Volunteer'}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
