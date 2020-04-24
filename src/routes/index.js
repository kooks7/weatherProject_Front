import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Detail from './Detail';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <Home {...props} />} />
      <Route path="/:id" component={Detail} />
    </Switch>
  </BrowserRouter>
);
