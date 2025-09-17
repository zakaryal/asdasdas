// FIX: Removed stray 'S' character from import statement.
import React, { useState, useEffect, useMemo } from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';
import { Project, Activity } from '../types';
import { getProjects, getRecentActivity } from '../services/api';
import { 
  calculateMaterialCost, 
  calculateLaborCost, 
  calculateTotalCost, 
  calculateCostVariance,
  calculateProjectedCost,
  calculatePhaseCost
} from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { DocumentTextIcon, ScaleIcon } from '../components/icons';
import CostPieChart from '../components/dashboard/CostPieChart';
import PhaseBarChart from '../components/dashboard/PhaseBarChart';
import BudgetTracker from '../components/dashboard/BudgetTracker';
import KPICard from '../components/dashboard/KPICard';
import ForecastingCard from '../components/dashboard/ForecastingCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const [projectData, activityData] = await Promise.all([
        getProjects(user),
        getRecentActivity(),
      ]);
      setProjects(projectData);
      setActivities(activityData);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const {
    activeProject,
    displayName,
    totalBudget,
    totalCost,
    totalMaterialCost,
    totalLaborCost,
    costVariance,
    projectedCost,
  } = useMemo(() => {
    const selectedProjects = selectedProjectId === 'all'
      ? projects
      : projects.filter(p => p.id === selectedProjectId);
    
    const activeProject = selectedProjects.length === 1 ? selectedProjects[0] : null;

    const allPhases = selectedProjects.flatMap(p => p.phases);
    const budget = selectedProjects.reduce((sum, p) => sum + p.budget, 0);
    const cost = calculateTotalCost({ phases: allPhases });

    return {
      activeProject,
      displayName: activeProject?.name ?? (projects.length > 1 ? 'All Assigned Projects' : 'Dashboard'),
      totalBudget: budget,
      totalCost: cost,
      totalMaterialCost: calculateMaterialCost(allPhases),
      totalLaborCost: calculateLaborCost(allPhases),
      costVariance: calculateCostVariance(budget, cost),
      projectedCost: activeProject ? calculateProjectedCost(activeProject) : 0,
    };
  }, [projects, selectedProjectId]);


  if (loading) {
    return <div className="text-center p-8">Loading dashboard data...</div>;
  }

  const costBreakdownData = [
    { name: 'Material Costs', value: totalMaterialCost },
    { name: 'Labor Costs', value: totalLaborCost },
  ];

  const chartData = activeProject
    ? activeProject.phases.map(phase => ({
        name: phase.name.replace(/ & /g, '&').split(' ')[0], // Shorten name
        cost: calculatePhaseCost(phase),
      }))
    : projects.map(p => ({
        name: p.name.split(' ')[0],
        cost: calculateTotalCost(p),
      }));
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user?.name}. Here's your project overview.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label htmlFor="projectFilter" className="sr-only">Filter by project</label>
          <select
            id="projectFilter"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Cost" value={formatCurrency(totalCost)} icon={ScaleIcon} color="bg-yellow-500" />
        <SummaryCard title="Total Budget" value={formatCurrency(totalBudget)} icon={DocumentTextIcon} color="bg-green-500" />
        <KPICard 
          title="Cost Variance" 
          value={costVariance} 
          status={costVariance >= 0 ? 'positive' : 'negative'}
          subtitle={costVariance >= 0 ? 'Under Budget' : 'Over Budget'}
        />
        <ForecastingCard
          title="Cost Forecast"
          projectedCost={projectedCost}
          budget={activeProject?.budget ?? 0}
        />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          <PhaseBarChart data={chartData} />
          {selectedProjectId === 'all' && projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Individual Project Budgets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <BudgetTracker 
                    key={project.id}
                    title={project.name}
                    current={calculateTotalCost(project)}
                    total={project.budget}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6 lg:space-y-8">
            <CostPieChart data={costBreakdownData} />
            <RecentActivity activities={activities} projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;