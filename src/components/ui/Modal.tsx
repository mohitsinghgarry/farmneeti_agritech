import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LucideIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconVariant?: 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  iconVariant,
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const iconColors = {
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-50"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {Icon && iconVariant && (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColors[iconVariant]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                      {description && (
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
