import axios from 'axios';
import React from 'react';

function Login() {
    return (
        <div className="medium-container" > 
            <div className='fullscreen vertical-center test-div'>
                <a className="button accent-button center" href="/api/auth/login" >
                    Login with Spotify 
                </a>
            </div>
        </div>
    );
}

export default Login;