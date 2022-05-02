import React, { useState, useEffect } from 'react';
import Header from './Header'
import axios from 'axios'
import Userdata from './Userdata';
import Form from './Form/Form';
import Test from './Test';


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


function Body ({token, userdata, setUserdata}) {

    // const [userdata, setUserdata] = useState(userDataDefault);
    const [testState, setTestState] = useState("c")


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
    

    return(
        <div className="medium-container">
            <Header userdata={userdata} />
            <div className='medium-container'>
                <Userdata userdata={userdata} />
            </div>
            <Form token={token} user_id={userdata.id} />
            {/* <Test s={testState} changeS={setTestState} /> */}
        </div>
    )
}

export default Body 