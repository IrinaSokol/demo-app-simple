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

export type NewAssetInput = {
  name: string;
  type: string;
  status: string;
};

export function createAsset(input: NewAssetInput): Promise<Asset> {
  return apiFetch<Asset>('/api/assets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
