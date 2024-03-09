import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { onboardinglistPlugin, OnboardinglistPage } from '../src/plugin';

createDevApp()
  .registerPlugin(onboardinglistPlugin)
  .addPage({
    element: <OnboardinglistPage />,
    title: 'Root Page',
    path: '/onboardinglist'
  })
  .render();
