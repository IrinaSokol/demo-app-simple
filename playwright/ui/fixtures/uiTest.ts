import { test as apiTest, expect } from '../../api/fixtures/apiTest';
import { LoginPage } from '../pages/LoginPage';
import { ProjectsDashboardPage } from '../pages/dashboards/ProjectsDashboardPage';
import { AssetsDashboardPage } from '../pages/dashboards/AssetsDashboardPage';

type UiFixtures = {
  loginPage: LoginPage;
  projectsDashboard: ProjectsDashboardPage;
  assetsDashboard: AssetsDashboardPage;
};

/**
 * UI layer: extends API fixtures so tests can reset data via API and drive the app via pages.
 *
 * @example
 * test.beforeEach(async ({ api, token }) => {
 *   await api.admin.resetDemoData(token!);
 * });
 */
export const test = apiTest.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  projectsDashboard: async ({ page }, use) => {
    await use(new ProjectsDashboardPage(page));
  },
  assetsDashboard: async ({ page }, use) => {
    await use(new AssetsDashboardPage(page));
  },
});

export { expect };
