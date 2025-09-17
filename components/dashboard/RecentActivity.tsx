import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Project } from '../../types';
import Card from '../shared/Card';
import { PlusIcon, CheckCircleIcon, BellIcon, PencilSquareIcon, ClockIcon } from '../icons';

interface RecentActivityProps {
  activities: Activity[];
  projects: Project[];
}

const activityIcons: { [key in Activity['type']]: React.ReactElement } = {
  creation: <PlusIcon className="h-5 w-5 text-white" />,
  completion: <CheckCircleIcon className="h-5 w-5 text-white" />,
  deadline: <BellIcon className="h-5 w-5 text-white" />,
  update: <PencilSquareIcon className="h-5 w-5 text-white" />,
};

const activityColors: { [key in Activity['type']]: string } = {
    creation: 'bg-blue-500',
    completion: 'bg-green-500',
    deadline: 'bg-yellow-500',
    update: 'bg-purple-500',
  };


const TimeAgo: React.FC<{ date: string }> = ({ date }) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return <span>{days}d ago</span>;
    if (hours > 0) return <span>{hours}h ago</span>;
    if (minutes > 0) return <span>{minutes}m ago</span>;
    return <span>just now</span>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, projects }) => {
  return (
    <Card title="Recent Activity" className="h-full">
        <ul className="divide-y divide-slate-200">
            {activities.map(activity => {
                const project = projects.find(p => p.id === activity.projectId);
                return (
                    <li key={activity.id} className="py-3">
                        <Link to={`/projects/${activity.projectId}`} className="block hover:bg-slate-50 p-2 rounded-md">
                            <div className="flex items-start space-x-3">
                                <div className={`rounded-full p-2 ${activityColors[activity.type]}`}>
                                    {activityIcons[activity.type]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-800">
                                        <span className="font-semibold">{project?.name || 'A project'}</span>: {activity.text}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <ClockIcon className="h-3 w-3" />
                                        <TimeAgo date={activity.timestamp} />
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    </Card>
  );
};

export default RecentActivity;