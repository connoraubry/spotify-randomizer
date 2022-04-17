import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { PROPERTY_TYPES } from '@babel/types';




function Data ({url, token, dataType}) {

    const [data, setData] = useState({});


    function onClick() {
        console.log("Button clicked!")

        console.log("Pinging " + url)

        axios.get(url, {
            params: {
                access_token: token
            }
            })
          .then(function (response){
              console.log(response.data)
              setData(response.data)
          })

    }

    return(
        <div>
            {dataType}
            <button onClick={onClick}>Find Data</button>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
    
}

export default Data 