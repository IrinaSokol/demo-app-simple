export type ProjectRow = {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Draft' | 'Archived';
  updatedAt: string;
};

export type AssetRow = {
  id: string;
  name: string;
  type: 'Laptop' | 'License' | 'Device';
  status: 'Available' | 'Assigned' | 'Retired';
  updatedAt: string;
};

export const INITIAL_PROJECTS: ProjectRow[] = [
  {
    id: 'p1',
    name: 'Demo Project 1',
    owner: 'Alex Morgan',
    status: 'Active',
    updatedAt: '2025-03-01T10:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Demo Project 2',
    owner: 'Jordan Lee',
    status: 'Draft',
    updatedAt: '2025-03-10T14:30:00.000Z',
  },
  {
    id: 'p3',
    name: 'Demo Project 3',
    owner: 'Sam Rivera',
    status: 'Archived',
    updatedAt: '2025-02-15T09:15:00.000Z',
  },
];

export const INITIAL_ASSETS: AssetRow[] = [
  {
    id: 'a1',
    name: 'Demo Asset A',
    type: 'Laptop',
    status: 'Available',
    updatedAt: '2025-03-12T11:00:00.000Z',
  },
  {
    id: 'a2',
    name: 'Demo Asset B',
    type: 'License',
    status: 'Assigned',
    updatedAt: '2025-03-11T16:45:00.000Z',
  },
  {
    id: 'a3',
    name: 'Demo Asset C',
    type: 'Device',
    status: 'Retired',
    updatedAt: '2025-01-20T08:00:00.000Z',
  },
];

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

const PROJECT_STATUSES: ProjectRow['status'][] = ['Active', 'Draft', 'Archived'];
const ASSET_TYPES: AssetRow['type'][] = ['Laptop', 'License', 'Device'];
const ASSET_STATUSES: AssetRow['status'][] = ['Available', 'Assigned', 'Retired'];

export function createDataStore() {
  let projects = clone(INITIAL_PROJECTS);
  let assets = clone(INITIAL_ASSETS);

  return {
    getProjects(): ProjectRow[] {
      return projects;
    },
    getAssets(): AssetRow[] {
      return assets;
    },
    addProject(input: {
      name: string;
      owner: string;
      status: ProjectRow['status'];
    }): ProjectRow {
      const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const row: ProjectRow = {
        id,
        name: input.name.trim(),
        owner: input.owner.trim(),
        status: input.status,
        updatedAt: new Date().toISOString(),
      };
      projects.push(row);
      return row;
    },
    addAsset(input: {
      name: string;
      type: AssetRow['type'];
      status: AssetRow['status'];
    }): AssetRow {
      const id = `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const row: AssetRow = {
        id,
        name: input.name.trim(),
        type: input.type,
        status: input.status,
        updatedAt: new Date().toISOString(),
      };
      assets.push(row);
      return row;
    },
    reset(): void {
      projects = clone(INITIAL_PROJECTS);
      assets = clone(INITIAL_ASSETS);
    },
  };
}

export { PROJECT_STATUSES, ASSET_TYPES, ASSET_STATUSES };

export type DataStore = ReturnType<typeof createDataStore>;
