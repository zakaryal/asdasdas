import { MOCK_PROJECTS, MOCK_USERS, MOCK_ACTIVITIES } from './mockData';
import { Project, User, CostOverTimeData, Activity, UserRole } from '../types';
import { calculateTotalCost } from '../utils/calculations';

// Simulate API latency
const LATENCY = 500;

export const getProjects = (user: User): Promise<Project[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (user.role === UserRole.Contractor) {
        const userProjects = MOCK_PROJECTS.filter(p => p.teamMemberIds.includes(user.id));
        resolve(JSON.parse(JSON.stringify(userProjects)));
      } else {
        resolve(JSON.parse(JSON.stringify(MOCK_PROJECTS)));
      }
    }, LATENCY);
  });
};

export const getProjectById = (id: string, user: User): Promise<Project | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const project = MOCK_PROJECTS.find(p => p.id === id);
      if (!project) {
        resolve(undefined);
        return;
      }
      
      if (user.role === UserRole.Contractor && !project.teamMemberIds.includes(user.id)) {
        resolve(undefined); // Contractor is not on this project team
      } else {
        resolve(project);
      }
    }, LATENCY);
  });
};

export const getUsers = (): Promise<User[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_USERS)));
    }, LATENCY);
  });
};

export const createUser = (userData: Omit<User, 'id'>): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (MOCK_USERS.some(u => u.email === userData.email)) {
                reject(new Error("User with this email already exists."));
                return;
            }
            const newUser: User = {
                ...userData,
                id: `user-${Date.now()}`,
            };
            MOCK_USERS.unshift(newUser);
            resolve(newUser);
        }, LATENCY);
    });
};

// FIX: Cannot reassign an imported variable. Modified the array in place.
export const deleteUser = (userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                MOCK_USERS.splice(userIndex, 1);
                resolve();
            } else {
                reject(new Error("User not found."));
            }
        }, LATENCY);
    });
};

export const getCostOverTime = (project: Project): Promise<CostOverTimeData[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const data: CostOverTimeData[] = [];
            if (!project) {
                resolve([]);
                return;
            }

            const sortedPhases = [...project.phases].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            let cumulativeCost = 0;

            sortedPhases.forEach(phase => {
                const phaseCost = calculateTotalCost({ phases: [phase] });
                cumulativeCost += phaseCost;
                data.push({
                    date: new Date(phase.endDate).toLocaleDateString('en-CA'), // YYYY-MM-DD
                    cost: cumulativeCost
                });
            });

            resolve(data);
        }, LATENCY);
    });
};

export const createProject = (projectData: Omit<Project, 'id' | 'phases'>): Promise<Project> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        phases: [], // Start with no phases
      };
      // Add to the beginning of the list to be more visible
      MOCK_PROJECTS.unshift(newProject);
      resolve(newProject);
    }, LATENCY);
  });
};

export const updateProject = (projectId: string, projectData: Omit<Project, 'id' | 'phases'>): Promise<Project> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        const updatedProject = { ...MOCK_PROJECTS[projectIndex], ...projectData };
        MOCK_PROJECTS[projectIndex] = updatedProject;
        resolve(updatedProject);
      } else {
        reject(new Error("Project not found"));
      }
    }, LATENCY);
  });
};

export const getRecentActivity = (): Promise<Activity[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_ACTIVITIES);
    }, LATENCY);
  });
};