import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { PROPERTY_TYPES } from '@babel/types';




function Data ({url, token, dataType}) {

    const [data, setData] = useState({});


    function onClick() {

        axios.get(url, {
            params: {
                access_token: token
            }
            })
          .then(function (response){
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