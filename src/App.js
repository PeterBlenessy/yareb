import React from 'react';
import { Navbar, Button, Alignment } from '@blueprintjs/core';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


function Home() {
  return (
    <span>
    <h2>This is a potential home page</h2>
      <p>Edit <code>src/App.js</code> and save to reload.</p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
    </span>
  );
}

function Settings() {
  return (
    <h2>This is a potential settings page</h2>
  );
}

function Info() {
  return (
    <div>
      <h2>This is a potential settings page</h2>
      <p>To get information about the devices and behavior of our users, we use Nucleus to provide analytics. 
      This service gives us insight about how users interact with our software. 
      It does not store any personal identifiable information. 
      Visit their <a className="App-link" href="https://www.nucleus.sh/transparency" target="_blank" rel="noopener noreferer">transparency page</a> to get the full list of data they collect.
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
    <div className="App">
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Link class="bp3-button bp3-minimal bp3-icon-home"  to="/" />
          <Navbar.Divider />
          <Link class="bp3-button bp3-minimal bp3-icon-settings" to="/settings/" />
          <Navbar.Divider />
          <Link class="bp3-button bp3-minimal bp3-icon-info-sign" to="/info/" />
        </Navbar.Group>
      </Navbar>

      <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/settings/" component={Settings} />
          <Route path="/info/" component={Info} />
          <Redirect to="/" />
        </Switch>

      </header>

    </div>
    </Router>
  );
}

export default App;
