import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LikeButton from './components/LikeButton'
import MouseTracker from './components/MouseTracker'
import DogShow from './components/DogShow'
import useMousePosition from './hooks/useMousePosition'
function App() {

  const position = useMousePosition()

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>
            {position.x}
          </h1>
          <h2>Welcome to React</h2>
        </div>
        {/* <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <LikeButton />
        <MouseTracker />
        <DogShow /> */}
      </div>
    );
    
}

export default App;
