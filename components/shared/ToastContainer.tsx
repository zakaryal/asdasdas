import React from 'react';
import { useToastContext } from '../../context/ToastContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '../icons';

const ICONS = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    error: <XCircleIcon className="h-6 w-6 text-red-500" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onDismiss]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-sm flex items-start space-x-3 animate-fade-in-right">
            <div>{ICONS[type]}</div>
            <div className="flex-1 text-sm text-slate-700 font-medium">{message}</div>
            <button onClick={onDismiss} className="p-1 text-slate-400 hover:text-slate-600">
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
};


const ToastContainer = () => {
    const { toasts, removeToast } = useToastContext();

    return (
        <div className="fixed top-5 right-5 z-[100] space-y-3">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;