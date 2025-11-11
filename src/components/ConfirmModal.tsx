import React from "react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({ open, onClose, onConfirm }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-15 w-100 text-center">
        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
        <p className="text-gray-600 mb-6">This action cannot be undone.</p>

        <div className="flex justify-center gap-10">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
