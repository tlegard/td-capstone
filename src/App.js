import React, { Component } from 'react';

import './App.css';
import TrendingContainer from './components/TrendingContainer';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header>Trending Hashtags</header>
        <TrendingContainer />
      </div>
    );
  }
  
}

export default App;
