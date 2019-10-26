import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Constructor from 'pages/Constructor';
import StatisticsPage from 'pages/StatisticsPage';
import ClientPage from 'pages/ClientPage';
import { PageNotFound } from 'pages/ErrorPage';

function App() {
  return (
    <Switch>
      <Route path={'/'} render={(props) => <ClientPage {...props} />} exact />
      <Route path={'/admin'} render={(props) => <Constructor {...props} />} exact />
      <Route path={'/admin/statisctics'} render={(props) => <StatisticsPage {...props} />} exact />
      <Route render={(props) => <PageNotFound />} />
    </Switch>
  );
}

export default App;
