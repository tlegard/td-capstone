import React, { Component } from 'react';

export default class TwitterLogin extends Component {

    onSuccess = (response) => {
        const token = response.headers.get('x-auth-token');
        response.json().then(user => {
            if (token) {
                this.setState({ isAuthenticated: true, user: user, token: token });
            }
        });
    };

    onFail = (error) => {
        alert(error);
    }

    logOut = () => {
        this.setState({ isAuthenticated: false, token: '', user: null });
    }

    render() {
        let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            (
                <TwitterLogin
                    loginUrl="http://localhost:3000/api/v1/auth/twitter"
                    onFailure={this.onFail} onSuccess={this.onSuccess}
                    requestTokenUrl="http://localhost:3000/api/v1/auth/twitter/reverse" />
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}