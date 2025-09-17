import { Project, Notification } from '../types';
import { calculateTotalCost } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

export const getNotifications = (projects: Project[]): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));


  projects.forEach(project => {
    // 1. Budget check
    const totalCost = calculateTotalCost(project);
    if (totalCost > project.budget) {
      notifications.push({
        id: `over-budget-${project.id}`,
        message: `${project.name} is over budget by ${formatCurrency(totalCost - project.budget)}.`,
        type: 'warning',
        projectId: project.id,
        projectName: project.name,
      });
    }

    // 2. Deadline check
    const dateParts = project.endDate.split('-').map(p => parseInt(p, 10));
    const endDateUTC = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));

    if (endDateUTC < todayUTC) {
      return; // Project has already ended
    }

    const timeDiff = endDateUTC.getTime() - todayUTC.getTime();
    const daysRemaining = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 7) {
      let message: string;
      if (daysRemaining <= 0) {
        message = `${project.name} is ending today.`;
      } else if (daysRemaining === 1) {
        message = `${project.name} is ending tomorrow.`;
      } else {
        message = `${project.name} is ending in ${daysRemaining} days.`;
      }
      
      notifications.push({
        id: `deadline-${project.id}`,
        message,
        type: 'info',
        projectId: project.id,
        projectName: project.name,
      });
    }
  });

  return notifications;
};