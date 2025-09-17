import React, { useState, useEffect } from 'react';
import { Project, User } from '../types';
import { getProjects, getUsers } from '../services/api';
import { generateProjectReport } from '../services/reportService';
import Card from '../components/shared/Card';
import { useAuth } from '../context/AuthContext';

const ReportsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const [projectData, userData] = await Promise.all([getProjects(user), getUsers()]);
      setProjects(projectData);
      setUsers(userData);
      if (projectData.length > 0) {
        setSelectedProject(projectData[0].id);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleGenerateReport = () => {
    const project = projects.find(p => p.id === selectedProject);
    const projectManager = users.find(u => u.id === project?.projectManagerId);
    if (project && projectManager) {
      generateProjectReport(project, projectManager);
    } else {
      alert('Could not find project or project manager details.');
    }
  };
  
  if (loading) {
    return <div className="text-center p-8">Loading report options...</div>
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Generate Report</h1>
        <p className="text-slate-600 mb-6">Select a project to generate a detailed cost report.</p>

        <div className="space-y-4">
            <div>
                <label htmlFor="project" className="block text-sm font-medium text-slate-700 mb-1">
                    Project
                </label>
                <select
                    id="project"
                    name="project"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={projects.length === 0}
                >
                    {projects.length === 0 && <option>No projects available</option>}
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="mt-8">
            <button
                onClick={handleGenerateReport}
                disabled={!selectedProject}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400"
            >
                Download PDF Report
            </button>
            <p className="text-xs text-center text-slate-500 mt-2">
                Excel (XLSX) and CSV exports can be added here.
            </p>
        </div>
    </Card>
  );
};

export default ReportsPage;