import React from 'react';
import Header from './Header';

function Login() {
    return (
        <div className="medium-container" > 
        <Header userdata={{'display_name': ""}}/>
            <div className='fullscreen vertical-center'>
                <a className="button accent-button center" href="/auth/login" >
                    Login with Spotify 
                </a>
            </div>
        </div>
    );
}

export default Login;