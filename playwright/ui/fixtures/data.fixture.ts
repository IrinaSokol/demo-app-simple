import { SEED_ASSET_NAMES, SEED_PROJECT_NAMES } from '../../config/demoSeed';

/** Stable labels from the demo app seed (for UI expectations). */
export const demoData = {
  projectNames: SEED_PROJECT_NAMES,
  assetNames: SEED_ASSET_NAMES,
  primaryProject: 'Demo Project 1',
  primaryAsset: 'Demo Asset A',
} as const;
