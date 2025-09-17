import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { User, Project, UserRole } from '../types';
import { getUsers, getProjects, deleteUser } from '../services/api';
import Card from '../components/shared/Card';
import ProtectedComponent from '../components/shared/ProtectedComponent';
import CreateUserModal from '../components/users/CreateUserModal';
import ConfirmDeleteModal from '../components/shared/ConfirmDeleteModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlusIcon, TrashIcon } from '../components/icons';

const TeamPage = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const toast = useToast();

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        const [userData, projectData] = await Promise.all([getUsers(), getProjects(currentUser)]);
        setUsers(userData);
        setProjects(projectData);
        setLoading(false);
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const getUserProjects = (userId: string) => {
        return projects.filter(p => p.teamMemberIds && p.teamMemberIds.includes(userId));
    };

    const handleUserCreated = () => {
        toast.success("User created successfully!");
        fetchData();
    };

    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser(userToDelete.id);
            toast.success(`User "${userToDelete.name}" has been deleted.`);
            fetchData();
        } catch (error) {
            toast.error("Failed to delete user.");
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading team members...</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
                <ProtectedComponent allowedRoles={[UserRole.Admin]}>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold transition-colors"
                    >
                        <UserPlusIcon className="w-5 h-5" />
                        Create User
                    </button>
                </ProtectedComponent>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map(user => (
                    <Card key={user.id} className="flex flex-col">
                        <div className="flex-grow">
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-2xl mr-4 flex-shrink-0">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-lg font-bold text-slate-800 truncate">{user.name}</h3>
                                    <p className="text-sm text-slate-500">{user.role}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-4 break-words">{user.email}</p>
                            
                            <div>
                                <h4 className="font-semibold text-sm text-slate-700 mb-2">Assigned Projects</h4>
                                {getUserProjects(user.id).length > 0 ? (
                                    <ul className="space-y-1">
                                        {getUserProjects(user.id).map(p => (
                                            <li key={p.id}>
                                                <Link to={`/projects/${p.id}`} className="text-sm text-primary-600 hover:underline bg-primary-50 px-2 py-1 rounded-md inline-block">
                                                    {p.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-400">No projects assigned.</p>
                                )}
                            </div>
                        </div>
                         <ProtectedComponent allowedRoles={[UserRole.Admin]}>
                            {currentUser && currentUser.id !== user.id && (
                                <div className="border-t mt-4 pt-4 text-right">
                                    <button 
                                        onClick={() => openDeleteModal(user)}
                                        className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-semibold"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Delete User
                                    </button>
                                </div>
                            )}
                        </ProtectedComponent>
                    </Card>
                ))}
            </div>
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onUserCreated={handleUserCreated}
            />
            {userToDelete && (
                 <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteUser}
                    title="Delete User"
                    message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
                />
            )}
        </>
    );
};

export default TeamPage;