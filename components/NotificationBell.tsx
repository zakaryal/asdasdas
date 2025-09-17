import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, ExclamationTriangleIcon, InformationCircleIcon } from './icons';
import { getProjects } from '../services/api';
import { getNotifications } from '../services/notificationService';
import { Notification, Project } from '../types';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            const projects: Project[] = await getProjects(user);
            const newNotifications = getNotifications(projects);
            setNotifications(newNotifications);
        };
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 60000); // Re-check every minute

        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Toggle notifications"
            >
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2">
                        <div className="px-4 py-2 font-bold text-slate-800 border-b">Notifications</div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <Link 
                                        key={notification.id} 
                                        to={`/projects/${notification.projectId}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            {notification.type === 'warning' ? (
                                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">{notification.projectName}</p>
                                                <p>{notification.message}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-500">No new notifications</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;