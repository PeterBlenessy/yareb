import React from 'react';
import { Navbar, Button, Alignment } from '@blueprintjs/core';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Blueprint</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home" text="Home" />
          <Button className="bp3-minimal" icon="document" text="Files" />
          <span class="bp3-navbar-divider"></span>
          <button class="bp3-button bp3-minimal bp3-icon-user"></button>
          <button class="bp3-button bp3-minimal bp3-icon-notifications"></button>
          <button class="bp3-button bp3-minimal bp3-icon-cog"></button>
        </Navbar.Group>
      </Navbar>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <p>
        To get information about the devices and behavior of our users, we use Nucleus to provide analytics. 
        This service gives us insight about how users interact with our software. 
        It does not store any personal identifiable information. 
        Visit their <a className="App-link" href="https://www.nucleus.sh/transparency" target="_blank" rel="noopener noreferer">transparency page</a> to get the full list of data they collect.
        </p>
      </header>

    </div>
  );
}

export default App;
