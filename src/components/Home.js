/* eslint-disable */
import React from 'react';
import { EmptyState } from '@shopify/polaris';
import { withState } from 'recompose';
import { Redirect } from 'react-router-dom';

const Home = withState('to', 'setRedirect', false)(({ to, setRedirect }) => {
  if (to) {
    return <Redirect to={to} />;
  }
  return (
    <EmptyState
      heading="Realsies"
      action={{
        content: 'Start here',
        onAction: () => setRedirect(() => 'login')
      }}
      secondaryAction={{
        content: 'Learn more',
        url: 'https://www.realsies.com/'
      }}
    >
      <p>
        Ask someone to do something by a certain date. If they accept, they get
        charged money every day after the deadline that they don't deliver.
      </p>
    </EmptyState>
  );
});

export default Home;
