import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <Home {...props} />} />
    </Switch>
  </BrowserRouter>
);
