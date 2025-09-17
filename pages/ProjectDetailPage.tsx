import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Project, Phase, User, UserRole } from '../types';
import { getProjectById, getUsers } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { calculateTotalCost, calculatePhaseCost } from '../utils/calculations';
import Card from '../components/shared/Card';
import BudgetTracker from '../components/dashboard/BudgetTracker';
import CostOverTimeChart from '../components/dashboard/CostOverTimeChart';
import { getCostOverTime } from '../services/api';
import { PencilSquareIcon } from '../components/icons';
import EditProjectModal from '../components/projects/EditProjectModal';
import ProtectedComponent from '../components/shared/ProtectedComponent';
import { useAuth } from '../context/AuthContext';

const PhaseDetails: React.FC<{ phase: Phase }> = ({ phase }) => {
    return (
        <Card className="mb-4">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">{phase.name}</h4>
            <div className="text-sm text-slate-500 mb-4">{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h5 className="font-semibold text-slate-700 mb-2">Materials</h5>
                    <ul className="text-sm space-y-1">
                        {phase.materials.map(m => (
                            <li key={m.id} className="flex justify-between">
                                <span>{m.name}</span>
                                <span className="font-mono">{formatCurrency(m.quantity * m.unitPrice)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-slate-700 mb-2">Labor</h5>
                    <ul className="text-sm space-y-1">
                        {phase.labor.map(l => (
                            <li key={l.id} className="flex justify-between">
                                <span>{l.role}</span>
                                <span className="font-mono">{formatCurrency(l.hours * l.rate)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t text-right">
                <span className="font-bold text-slate-800">Phase Total: {formatCurrency(calculatePhaseCost(phase))}</span>
            </div>
        </Card>
    );
};

const ProjectDetailPage = () => {
  const { user } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [costData, setCostData] = useState([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
        const users = await getUsers();
        setAllUsers(users);
    }
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId || !user) return;
      setLoading(true);
      
      const projectData = await getProjectById(projectId, user);

      if (projectData) {
        setProject(projectData);

        const costOverTime = await getCostOverTime(projectData);
        setCostData(costOverTime);
      } else {
        setProject(null); // Explicitly set to null if not found or not authorized
      }
      
      setLoading(false);
    };
    fetchProject();
  }, [projectId, user]);

  useEffect(() => {
    if (project && allUsers.length > 0) {
        if (project.teamMemberIds) {
            const members = allUsers.filter(user => project.teamMemberIds.includes(user.id));
            setTeamMembers(members);
        }
    }
  }, [project, allUsers]);

  const handleProjectUpdated = (updatedProject: Project) => {
    setProject(updatedProject);
    // The useEffect listening to 'project' and 'allUsers' will automatically update teamMembers.
  };

  if (loading) {
    return <div className="text-center p-8">Loading project details...</div>;
  }

  if (!project) {
    return <div className="text-center p-8 text-red-500">Project not found or you do not have permission to view it.</div>;
  }

  return (
    <div className="space-y-6">
        <Card>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="mt-2 text-slate-600">{project.description}</p>
            <div className="mt-4 flex space-x-6 text-sm">
                <p><span className="font-semibold">Start Date:</span> {formatDate(project.startDate)}</p>
                <p><span className="font-semibold">End Date:</span> {formatDate(project.endDate)}</p>
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <BudgetTracker 
                    title="Overall Project Budget"
                    current={calculateTotalCost(project)}
                    total={project.budget}
                />
                <CostOverTimeChart data={costData} />
            </div>
            <div className="lg:col-span-1">
                <Card className="h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Project Team</h3>
                         <ProtectedComponent allowedRoles={[UserRole.Admin, UserRole.ProjectManager]}>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                title="Manage Team"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                            </button>
                        </ProtectedComponent>
                    </div>
                    <ul className="space-y-4">
                        {teamMembers.map(member => (
                            <li key={member.id} className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold flex-shrink-0">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">{member.name}</p>
                                    <p className="text-xs text-slate-500">{member.role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
        
        <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Project Phases</h2>
            {project.phases.map(phase => (
                <PhaseDetails key={phase.id} phase={phase} />
            ))}
        </div>

        {project && (
            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onProjectUpdated={handleProjectUpdated}
                project={project}
            />
        )}
    </div>
  );
};

export default ProjectDetailPage;