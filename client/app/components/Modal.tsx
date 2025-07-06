import React, { useMemo } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  modalClassName,
}: ModalProps) {
  const modalRoot = useMemo(() => document.getElementById("modal-root"), []);

  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className={`
      fixed inset-0 flex justify-center items-center bg-black/20
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
        bg-white rounded-xl shadow p-6 relative ${modalClassName}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-gray-400 hover:stroke-gray-600"
          >
            <path
              d="M20 20L4 4.00003M20 4L4.00002 20"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
