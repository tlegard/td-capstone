'use strict';

import './App.css';
import TrendingContainer from './components/TrendingContainer';
import TwitterLogin from 'react-twitter-auth';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {

    constructor() {
        super();

        this.state = {
            hashtags: [],
            giphys: [],
            isAuthenticated: false,
            user: null,
            token: ''
        };
    }

    onSuccess = (response) => {
        const token = response.headers.get('x-auth-token');
        response.json().then((user) => {
            if (token) {
                this.setState({ isAuthenticated: true, user: user, token: token });
            }
        });
    };

    onFailed = (error) => {
        alert(error);
    };

    logout = () => {
        this.setState({ isAuthenticated: false, token: '', user: null });
    };

    render() {
        let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <header>Trending Hashtags</header>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                    <TrendingContainer giphydata={this.state.giphys} hashtagdata={this.state.hashtags} />
                </div>
            ) :
            (
                <TwitterLogin loginUrl="http://localhost:8080/api/v1/auth/twitter"
                    onFailure={this.onFailed} onSuccess={this.onSuccess}
                    requestTokenUrl="http://localhost:8080/api/v1/auth/twitter/reverse" />
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    };

};