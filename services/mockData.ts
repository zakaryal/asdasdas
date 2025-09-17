import { User, UserRole, Project, Activity } from '../types';

export let MOCK_USERS: User[] = [
  { id: '1', name: 'Amine El Fassi', email: 'amine.elfassi@civicost.com', role: UserRole.Admin, password: 'password123' },
  { id: '2', name: 'Karim Benjelloun', email: 'karim.benjelloun@civicost.com', role: UserRole.ProjectManager, password: 'password123' },
  { id: '3', name: 'Fatima Alaoui', email: 'fatima.alaoui@civicost.com', role: UserRole.Contractor, password: 'password123' },
];

export let MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Tour de Bureaux, Casablanca',
    description: 'Un immeuble de bureaux de 20 étages au centre-ville. Architecture moderne et matériaux durables.',
    budget: 50000000,
    startDate: '2024-01-15',
    endDate: '2025-12-20',
    projectManagerId: '2',
    teamMemberIds: ['2', '3'],
    phases: [
      {
        id: 'phase-1-1',
        name: 'Fondation et Terrassement',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        materials: [
          { id: 'mat-1', name: 'Béton C40', quantity: 2000, unitPrice: 1500 },
          { id: 'mat-2', name: 'Acier d\'armature', quantity: 500, unitPrice: 8000 },
          { id: 'mat-3', name: 'Membrane d\'étanchéité', quantity: 5000, unitPrice: 100 },
        ],
        labor: [
          { id: 'lab-1', role: 'Opérateur de pelle', hours: 400, rate: 500 },
          { id: 'lab-2', role: 'Ouvrier polyvalent', hours: 2000, rate: 250 },
          { id: 'lab-3', role: 'Géomètre', hours: 100, rate: 800 },
        ],
      },
      {
        id: 'phase-1-2',
        name: 'Structure et Charpente',
        startDate: '2024-04-16',
        endDate: '2024-10-30',
        materials: [
          { id: 'mat-4', name: 'Poutres en acier', quantity: 800, unitPrice: 12000 },
          { id: 'mat-5', name: 'Platelage métallique', quantity: 15000, unitPrice: 150 },
          { id: 'mat-6', name: 'Boulons haute résistance', quantity: 50000, unitPrice: 20 },
        ],
        labor: [
          { id: 'lab-4', role: 'Monteur charpentes métalliques', hours: 5000, rate: 650 },
          { id: 'lab-5', role: 'Grutier', hours: 800, rate: 750 },
          { id: 'lab-6', role: 'Soudeur', hours: 2000, rate: 600 },
        ],
      },
      {
        id: 'phase-1-3',
        name: 'Façade et Finitions',
        startDate: '2024-11-01',
        endDate: '2025-05-15',
        materials: [
          { id: 'mat-7', name: 'Panneaux mur-rideau en verre', quantity: 2000, unitPrice: 3000 },
          { id: 'mat-8', name: 'Isolation extérieure', quantity: 18000, unitPrice: 80 },
          { id: 'mat-9', name: 'Cloison sèche', quantity: 40000, unitPrice: 50 },
          { id: 'mat-10', name: 'Peinture (Intérieur)', quantity: 500, unitPrice: 400 },
        ],
        labor: [
          { id: 'lab-7', role: 'Vitrier', hours: 3000, rate: 550 },
          { id: 'lab-8', role: 'Peintre', hours: 2500, rate: 450 },
          { id: 'lab-9', role: 'Électricien', hours: 3500, rate: 700 },
        ],
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Résidence Les Palmiers, Marrakech',
    description: 'Un complexe de 5 immeubles résidentiels de 50 logements chacun. Comprend l\'aménagement paysager et les commodités.',
    budget: 85000000,
    startDate: '2023-09-01',
    endDate: '2025-08-31',
    projectManagerId: '2',
    teamMemberIds: ['1', '2'],
    phases: [
      {
        id: 'phase-2-1',
        name: 'Préparation du Site et Réseaux',
        startDate: '2023-09-01',
        endDate: '2023-12-01',
        materials: [
          { id: 'mat-11', name: 'Tuyauterie PVC', quantity: 5000, unitPrice: 120 },
          { id: 'mat-12', name: 'Base de gravier', quantity: 3000, unitPrice: 200 },
        ],
        labor: [
          { id: 'lab-10', role: 'Ingénieur civil', hours: 300, rate: 900 },
          { id: 'lab-11', role: 'Plombier', hours: 800, rate: 600 },
        ],
      },
      {
        id: 'phase-2-2',
        name: 'Fondations des Bâtiments',
        startDate: '2023-12-02',
        endDate: '2024-05-30',
        materials: [
          { id: 'mat-13', name: 'Béton C30', quantity: 5000, unitPrice: 1400 },
          { id: 'mat-14', name: 'Barre d\'armature', quantity: 1200, unitPrice: 7500 },
        ],
        labor: [
          { id: 'lab-12', role: 'Finisseur en béton', hours: 2500, rate: 500 },
          { id: 'lab-13', role: 'Ouvrier polyvalent', hours: 4000, rate: 250 },
        ],
      },
      {
        id: 'phase-2-3',
        name: 'Finitions et Aménagement Paysager',
        startDate: '2024-06-01',
        endDate: '2025-08-31',
        materials: [
          { id: 'mat-15', name: 'Briques', quantity: 200000, unitPrice: 5 },
          { id: 'mat-16', name: 'Bardeaux de toiture', quantity: 25000, unitPrice: 40 },
          { id: 'mat-17', name: 'Terre végétale', quantity: 1000, unitPrice: 300 },
        ],
        labor: [
          { id: 'lab-14', role: 'Maçon', hours: 6000, rate: 550 },
          { id: 'lab-15', role: 'Couvreur', hours: 3000, rate: 480 },
          { id: 'lab-16', role: 'Paysagiste', hours: 2000, rate: 300 },
        ],
      },
    ],
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'act-1', type: 'creation', text: 'Amine El Fassi created a new project.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), projectId: 'proj-1' },
    { id: 'act-2', type: 'deadline', text: 'Project is approaching its deadline.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), projectId: 'proj-1' },
    { id: 'act-3', type: 'update', text: 'Karim Benjelloun updated the budget details.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), projectId: 'proj-2' },
    { id: 'act-4', type: 'completion', text: 'Phase "Fondation et Terrassement" was completed.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), projectId: 'proj-1' }
];