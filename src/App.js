import React from 'react';
import './App.css';

import { HashRouter, Route } from 'react-router-dom';
import About from './router/About';
import Home from './router/Home';
import Detail from './router/Detail';
import Navigation from './components/Navigation';

function App() {
  return (
    <HashRouter>
      <Navigation />
      {/* exact={true} 오직 내가 지정한 path만 가져오겠다. */}
      <Route path="/" exact={true} component={Home}></Route>
      <Route path="/about" component={About}></Route>
      <Route path="/forecast/:id" component={Detail} />
    </HashRouter>
  );
}

export default App;
