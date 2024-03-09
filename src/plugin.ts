import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const onboardinglistPlugin = createPlugin({
  id: 'onboardinglist',
  routes: {
    root: rootRouteRef,
  },
});

export const OnboardinglistPage = onboardinglistPlugin.provide(
  createRoutableExtension({
    name: 'OnboardinglistPage',
    component: () =>
      import('./components/Onboarding').then(m => m.Onboarding),
    mountPoint: rootRouteRef,
  }),
);
