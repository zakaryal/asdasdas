export enum UserRole {
  Admin = 'Admin',
  ProjectManager = 'Project Manager',
  Contractor = 'Contractor',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Labor {
  id: string;
  role: string;
  hours: number;
  rate: number;
}

export interface Phase {
  id: string;
  name: string;
  materials: Material[];
  labor: Labor[];
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  projectManagerId: string;
  phases: Phase[];
  teamMemberIds: string[];
}

export interface CostOverTimeData {
  date: string;
  cost: number;
}

export interface Notification {
  id:string;
  message: string;
  type: 'warning' | 'info';
  projectId: string;
  projectName: string;
}

export interface Activity {
  id: string;
  type: 'creation' | 'completion' | 'deadline' | 'update';
  text: string;
  timestamp: string;
  projectId: string;
}