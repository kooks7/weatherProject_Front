import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';

export default () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact render={(props) => <Home {...props} />} />
      {/* <Route path="/:id" component={Detail} /> */}
    </Switch>
  </HashRouter>
);
