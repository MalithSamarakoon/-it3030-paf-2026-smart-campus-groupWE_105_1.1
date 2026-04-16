import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-3xl border-2 border-green-400 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 p-3 rounded-2xl">
                        <AlertTriangle className="text-red-600 w-8 h-8" />
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-green-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-green-800 mb-2">Delete Account?</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    This action is permanent. All your data, including your profile settings and history, will be removed from the Smart Campus Hub.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-2xl border-2 border-green-400 text-green-800 font-bold hover:bg-green-50 transition-colors"
                    >
                        Keep Account
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;