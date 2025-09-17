import { Phase, Project } from '../types';

export const calculateMaterialCost = (phases: Phase[]): number => {
  return phases.reduce((total, phase) => {
    return total + phase.materials.reduce((phaseTotal, material) => {
      return phaseTotal + material.quantity * material.unitPrice;
    }, 0);
  }, 0);
};

export const calculateLaborCost = (phases: Phase[]): number => {
  return phases.reduce((total, phase) => {
    return total + phase.labor.reduce((phaseTotal, labor) => {
      return phaseTotal + labor.hours * labor.rate;
    }, 0);
  }, 0);
};

export const calculateTotalCost = (project: Pick<Project, 'phases'>): number => {
  return calculateMaterialCost(project.phases) + calculateLaborCost(project.phases);
};

export const calculatePhaseCost = (phase: Phase): number => {
    return calculateMaterialCost([phase]) + calculateLaborCost([phase]);
}

export const calculateCostVariance = (budget: number, totalCost: number): number => {
  return budget - totalCost;
};

export const calculateProjectedCost = (project: Project): number => {
  const today = new Date();
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const totalCost = calculateTotalCost(project);

  // If project is over, the final cost is the total cost
  if (today > endDate) {
    return totalCost;
  }
  
  // If project hasn't started, we can't project anything
  if (today < startDate) {
    return totalCost; // Return current cost, which would be 0 or pre-loaded costs
  }

  const totalDuration = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const elapsedDuration = Math.max(1, (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  if (totalCost === 0) return 0;

  const dailyCostRate = totalCost / elapsedDuration;
  return dailyCostRate * totalDuration;
};

export const calculateProjectProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now >= end) return 100;

    const totalDuration = end - start;
    const elapsedDuration = now - start;
    
    if (totalDuration === 0) return 100;

    return Math.round((elapsedDuration / totalDuration) * 100);
};

export const getProjectStatus = (project: Pick<Project, 'startDate' | 'endDate'>): 'Upcoming' | 'In Progress' | 'Completed' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);

    if (today < startDate) return 'Upcoming';
    if (today > endDate) return 'Completed';
    return 'In Progress';
};