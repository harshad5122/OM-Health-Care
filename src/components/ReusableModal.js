// components/common/Modal.js
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
function ReusableModal({ isOpen, onClose, title, children,modalClassName = "" }) {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50`}>
            <div className={`bg-white rounded shadow-lg  px-4 pt-4 pb-2 relative ${modalClassName}`}>
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-xl font-semibold text-gray-800">{title}</p>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <CloseIcon className="text-gray-800"/>
                    </button>
                </div>

                {/* Content */}
                <div className="py-2">{children}</div>
            </div>
        </div>
    );
}

export default ReusableModal;
