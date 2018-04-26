import React from 'react';
import * as auth from '../firebase/auth';

const SignIn = () => {
    return (
        <div>
            <h1>Sign In Page</h1>

            <hr />

            <button onClick={auth.signIn}>Twitter Signin</button>
        </div>
    );
}

export default SignIn;