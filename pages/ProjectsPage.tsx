import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Project, UserRole } from '../types';
import { getProjects } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { calculateTotalCost, calculateProjectProgress, getProjectStatus } from '../utils/calculations';
import Card from '../components/shared/Card';
import ProtectedComponent from '../components/shared/ProtectedComponent';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import EditProjectModal from '../components/projects/EditProjectModal';
import { PlusIcon, MagnifyingGlassIcon } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getProjects(user);
    setProjects(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
    toast.success(`Project "${newProject.name}" created successfully!`);
    fetchProjects();
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    toast.success(`Project "${updatedProject.name}" updated successfully!`);
    fetchProjects();
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };
  
  const statusStyles: { [key: string]: string } = {
    'Upcoming': "bg-slate-100 text-slate-800",
    'In Progress': "bg-blue-100 text-blue-800",
    'Completed': "bg-green-100 text-green-800",
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        if (filterStatus === 'All') return true;
        return getProjectStatus(project) === filterStatus;
      })
      .filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [projects, searchTerm, filterStatus]);

  if (loading) {
    return <div className="text-center p-8">Loading projects...</div>;
  }

  return (
    <>
      <Card>
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
              <ProtectedComponent allowedRoles={[UserRole.Admin, UserRole.ProjectManager]}>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Project
                </button>
              </ProtectedComponent>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="relative w-full sm:w-auto flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by project name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                    <option>All</option>
                    <option>Upcoming</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
            </div>
          </div>

          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                          <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => {
                          const totalCost = calculateTotalCost(project);
                          const isOverBudget = totalCost > project.budget;
                          const progress = calculateProjectProgress(project.startDate, project.endDate);
                          const status = getProjectStatus(project);
                          return (
                              <tr key={project.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <Link to={`/projects/${project.id}`} className="text-sm font-semibold text-primary-700 hover:underline">{project.name}</Link>
                                      <div className="text-xs text-gray-500">{project.description.substring(0, 40)}...</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                          <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                                              <div className="bg-primary-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
                                          </div>
                                          <span className="text-xs font-medium text-slate-600">{progress}%</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
                                        {status}
                                    </span>
                                  </td>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(totalCost)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(project.budget)}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                      <Link to={`/projects/${project.id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                                      <ProtectedComponent allowedRoles={[UserRole.Admin, UserRole.ProjectManager]}>
                                        <button onClick={() => handleEditClick(project)} className="text-yellow-600 hover:text-yellow-900">
                                            Edit
                                        </button>
                                      </ProtectedComponent>
                                  </td>
                              </tr>
                          )
                        })
                      ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-500">
                                {projects.length === 0 ? "No projects created yet." : "No projects match your criteria."}
                            </td>
                        </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </Card>
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
      {selectedProject && (
        <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onProjectUpdated={handleProjectUpdated}
            project={selectedProject}
        />
      )}
    </>
  );
};

export default ProjectsPage;