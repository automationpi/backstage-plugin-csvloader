import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { YamlFetchComponent } from '../YamlFetchComponent/YamlFetchComponent';

export const Onboarding = () => (
  <Page themeId="tool">
    <Header title="Welcome to Your Onboarding tasks" subtitle="Track your progress!">

    </Header>
    <Content>
      <ContentHeader title="My Onboarding Tasks">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title="Welcome Onboard!">
            <Typography variant="body1">
              The purpose of the "My Onboarding Tasks" page is to assist new employees as they embark on their journey with the organization. It serves as a comprehensive guide, designed to streamline the onboarding process, making it more efficient, engaging, and less overwhelming for newcomers. By providing a structured pathway through various tasks and essential information, this page aims to facilitate a smooth transition into the company, ensuring that new team members feel well-informed, prepared, and welcomed from their very first day.
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item>
          <YamlFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
