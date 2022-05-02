import React, { useState, useEffect } from 'react';
import Login from './Login'
import Body from './Body';


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

function App() {

  const [token, setToken] = useState('');
  const [userdata, setUserdata] = useState(userDataDefault);


  useEffect(() => {

    async function getToken() {
      const response = await fetch('/api/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
        { 
          (token === '') ? 
            <Login/> : 
            <Body token={token} 
                  userdata={userdata} 
                  setUserdata={setUserdata} /> }
    </>
  );
}


export default App;
