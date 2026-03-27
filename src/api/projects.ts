import { apiFetch } from './client';

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: string;
  updatedAt: string;
};

export function fetchProjects(): Promise<Project[]> {
  return apiFetch<Project[]>('/api/projects');
}

export type NewProjectInput = {
  name: string;
  owner: string;
  status: string;
};

export function createProject(input: NewProjectInput): Promise<Project> {
  return apiFetch<Project>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
