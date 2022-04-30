import React, { useState, useEffect } from 'react';
import Header from './Header'
import axios from 'axios'
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


    useEffect(() => {
        if (userdata.id == "")
            getUserData();
    
    }, []);

    async function getUserData() {
        axios.get('/api/userdata', {
            params: {
                access_token: token 
            }
        })
            .then((response) => {
                setUserdata(response.data.userdata)
            })
    }
    

    function onClick() {
        getUserData();
    }

    // function testButtonOnClick() { 
    //     axios.get('/api/test3', {
    //         params: {
    //             access_token: token,
    //             // playlist_id: '5jk94t4rDDvKuLaPhoGNb2',
    //             user_id: userdata.id
    //         }
    //     })
    //         .then((response) => {
    //             console.log(response)
    //         })
    // }

    return(
        <div className="medium-container">
            {/* <button onClick={testButtonOnClick}>Test Button</button> */}
            <Header userdata={userdata} />
            <div className='medium-container'>
                {/* <button onClick={onClick}>Get user data</button> */}
                <Userdata userdata={userdata} />
            </div>
            <div className='medium-container'>
                <Playlist token={token} user_id={userdata.id} url={"/api/playlists"} dataType={"Playlist Data"}/>
            </div>
        </div>

    )
    
}

export default Body 