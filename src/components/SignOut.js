import React from 'react';
import * as auth from '../firebase/auth';

const SignOut = () => {
    return (
        <div>
            <h1>Sign Out Page</h1>

            <hr/>

            <button onClick={auth.signOut}>Twitter Signout</button>
        </div>
    );
}

export default SignOut;