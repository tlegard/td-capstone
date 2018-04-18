'use strict';

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import TrendingContainer from './TrendingContainer';
import Navigation from './Navigation';

const App = () => {
    return (
        <Router>
            <Navigation />
        </Router>
    );
};

export default App;