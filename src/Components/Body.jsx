import React, { useState, useEffect } from 'react';
import Header from './Header'
import axios from 'axios'
import Data from './Data'
import Userdata from './Userdata';
import Playlist from './Playlists';
import Songs from './Songs';

var userDataDefault =  {
    "country": "",
    "display_name": "",
    "email": "",
    "explicit_content":
        {"filter_enabled": false,
        "filter_locked": false
    },
    "external_urls":{
        "spotify": ""
    },
    "followers":{
        "href": "",
        "total": 0
    },
    "href": "",
    "id": "",
    "images": [],
    "product": "",
    "type": "",
    "uri": ""
}


function Body ({token}) {


    const [userdata, setUserdata] = useState(userDataDefault);

    function onClick() {
        axios.get('/api/userdata', {
            params: {
                access_token: token
            }
            })
          .then(function (response){
              setUserdata(response.data.userdata)
          })

    }

    function testButtonOnClick() { 
        axios.get('/api/test2', {
            params: {
                access_token: token
            }
        })
            .then((response) => {
                console.log(response)
            })
    }


    return(
        <div className="medium-container">
            <button onClick={testButtonOnClick}>Test Button</button>
            <Header userdata={userdata} />
            <div className='medium-container'>
                <button onClick={onClick}>Get user data</button>
                <Userdata userdata={userdata} />
            </div>
            <div className='medium-container'>
                <Playlist token={token} url={"/api/playlists"} dataType={"Playlist Data"}/>
                    {/* <Songs token={token} url={"/auth/top-songs"} dataType={"test"} /> */}
            </div>
        </div>

    )
    
}

export default Body 