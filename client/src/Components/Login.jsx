import React from 'react';
import Button from './Button';

function Login() {
    return (
        <div className="medium-container" > 
            <div className='fullscreen vertical-center test-div'>
                <a className="button accent-button center" href="/auth/login" >
                    Login with Spotify 
                </a>
            </div>
            {/* <Button /> */}
        </div>
    );
}

export default Login;