import React, { useEffect } from 'react';
import { Notification } from '../types';

interface ToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<{ notification: Notification; onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
    
    // Auto dismiss
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(notification.id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    const getStyles = () => {
        switch (notification.type) {
            case 'SUCCESS':
                return 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-900/80';
            case 'ERROR':
                return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] bg-red-900/80';
            default: // INFO
                return 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-900/80';
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'SUCCESS': return '✓';
            case 'ERROR': return '!';
            default: return 'i';
        }
    };

    return (
        <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border backdrop-blur-md p-4 mb-3 flex items-start gap-3 transition-all animate-slide-left ${getStyles()}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-black/20 shrink-0`}>
                {getIcon()}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-white">{notification.message}</p>
            </div>
            <button onClick={() => onDismiss(notification.id)} className="text-white/50 hover:text-white">
                ×
            </button>
        </div>
    );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onDismiss }) => {
    return (
        <div className="fixed top-24 right-4 z-[100] flex flex-col items-end pointer-events-none">
            {notifications.map(n => (
                <ToastItem key={n.id} notification={n} onDismiss={onDismiss} />
            ))}
        </div>
    );
};