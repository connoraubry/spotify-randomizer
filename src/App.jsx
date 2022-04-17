import React, { useState, useEffect } from 'react';
import Login from './Login'
import Body from './Body';

function App() {

  const [token, setToken] = useState('');


  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
        { (token === '') ? <Login/> : <Body token={token} /> }
    </>
  );
}


export default App;
