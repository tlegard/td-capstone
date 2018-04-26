'use strict';

import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import PropTypes from 'prop-types';

import TrendingContainer from './TrendingContainer';
import Navigation from './Navigation';
import Landing from './Landing';
import SignIn from './SignIn';
import SignOut from './SignOut';
import Home from './Home';

import * as routes from '../constants/routes';
import * as firebase from '../firebase/firebase';
import * as auth from '../firebase/auth';

const App = () => {
    return (
        <Router>
            <div>
                <Navigation />

                <hr />

                <Route
                    exact path={routes.LANDING}
                    component={() => <Landing />}
                />
                {
                    auth.signIn.token ? <Route
                        exact path={routes.SIGN_OUT}
                        component={() => <SignOut />}
                    />
                        :
                        <Route
                            exact path={routes.SIGN_IN}
                            component={() => <SignIn />}
                        />
                }
                <Route
                    exact path={routes.HOME}
                    component={() => <Home />}
                />
            </div>
        </Router>
    );
};

export default App;