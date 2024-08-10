// components/SuccessModal.tsx
import React from 'react';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Tu registro ha sido exitoso.</h2>
          <p className="text-center text-blue-800 mb-2">{message}</p>
          <p className="text-center text-gray-800"> Recuerde que su usuario es único e intransferible para acceder al evento. </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
