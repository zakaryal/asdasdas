import React, { useState, useEffect } from 'react';
import { Project, User, UserRole } from '../../types';
import { getUsers, createProject } from '../../services/api';
import { XMarkIcon } from '../icons';
import { useToast } from '../../context/ToastContext';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectManagerId, setProjectManagerId] = useState('');
  const [projectManagers, setProjectManagers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        const users = await getUsers();
        setAllUsers(users);
        const pms = users.filter(u => u.role === UserRole.ProjectManager || u.role === UserRole.Admin);
        setProjectManagers(pms);
        if (pms.length > 0) {
          const firstPmId = pms[0].id;
          setProjectManagerId(firstPmId);
          setSelectedTeamIds(new Set([firstPmId]));
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    // Ensure the selected project manager is always in the team
    if (projectManagerId) {
      setSelectedTeamIds(prev => new Set(prev).add(projectManagerId));
    }
  }, [projectManagerId]);


  const resetForm = () => {
      setName('');
      setDescription('');
      setBudget('');
      setStartDate('');
      setEndDate('');
      if (projectManagers.length > 0) {
        const firstPmId = projectManagers[0].id;
        setProjectManagerId(firstPmId);
        setSelectedTeamIds(new Set([firstPmId]));
      } else {
        setProjectManagerId('');
        setSelectedTeamIds(new Set());
      }
      setError('');
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleTeamMemberChange = (userId: string) => {
    setSelectedTeamIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(startDate) >= new Date(endDate)) {
        setError('End date must be after the start date.');
        return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const newProjectData = {
        name,
        description,
        budget: parseFloat(budget),
        startDate,
        endDate,
        projectManagerId,
        teamMemberIds: Array.from(selectedTeamIds),
      };
      const newProject = await createProject(newProjectData);
      onProjectCreated(newProject);
      handleClose();
    } catch (err) {
      setError('Failed to create project. Please try again.');
      toast.error('Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-slate-800">Create New Project</h2>
          <button onClick={handleClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Project Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700">Budget (MAD)</label>
                  <input type="number" id="budget" value={budget} onChange={e => setBudget(e.target.value)} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
              </div>
                <div>
                  <label htmlFor="projectManager" className="block text-sm font-medium text-slate-700">Project Manager</label>
                  <select id="projectManager" value={projectManagerId} onChange={e => setProjectManagerId(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white py-2 px-3">
                      {projectManagers.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
                  </select>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">Start Date</label>
                  <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-slate-700">End Date</label>
                  <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Assign Team</label>
            <div className="mt-2 border rounded-md max-h-40 overflow-y-auto p-2 space-y-1 bg-slate-50">
                {allUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-100">
                        <div>
                            <span className="font-medium text-slate-800 text-sm">{user.name}</span>
                            <span className="text-xs text-slate-500 ml-2">{user.role}</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={selectedTeamIds.has(user.id)}
                            onChange={() => handleTeamMemberChange(user.id)}
                            disabled={user.id === projectManagerId}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Assign ${user.name}`}
                        />
                    </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-semibold border border-slate-300">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold disabled:bg-slate-400">
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;