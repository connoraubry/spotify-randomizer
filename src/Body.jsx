import React, { useState, useEffect } from 'react';
import Header from './Header'
import axios from 'axios'
import Data from './Data'
import Userdata from './Userdata';
import Playlist from './Playlists';


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
        console.log("Button clicked!")

        axios.get('/auth/userdata', {
            params: {
                access_token: token
            }
            })
          .then(function (response){
              setUserdata(response.data.userdata)
          })

    }


    return(
        <div className="medium-container horizontal-center">
            <Header userdata={userdata} />
            <button onClick={onClick}>Get user data</button>
            <Userdata userdata={userdata} />
            <Playlist token={token} url={"/auth/playlists"} dataType={"Playlist Data"}/>
        </div>

    )
    
}

export default Body 