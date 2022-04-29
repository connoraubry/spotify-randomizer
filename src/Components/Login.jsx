import axios from 'axios';
import React from 'react';

function Login() {

    function clickTest(){
        axios.get('/api/test')
            .then(function(response){
                console.log(response.data)
            })
    }

    return (
        <div className="medium-container" > 
            <div className='fullscreen vertical-center test-div'>
                <a className="button accent-button center" href="/api/auth/login" >
                    Login with Spotify 
                </a>
                <button onClick={clickTest}>Test</button>   
            </div>

        </div>
    );
}

export default Login;