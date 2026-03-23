import { apiFetch } from './client';

export type Asset = {
  id: string;
  name: string;
  type: string;
  status: string;
  updatedAt: string;
};

export function fetchAssets(): Promise<Asset[]> {
  return apiFetch<Asset[]>('/api/assets');
}
