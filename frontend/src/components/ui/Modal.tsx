import React from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export function Modal({ open, title, message, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-6 min-w-[300px] max-w-[90vw]">
        {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
        <div className="mb-4 text-gray-800">{message}</div>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
