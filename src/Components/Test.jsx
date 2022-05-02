import React, { useState, useEffect } from 'react';

function Test ({s, changeS}) {


    function onClick() {
        let possible = ['1', '2', '3', '4', '5', '6', '7']
        let idx = Math.floor(Math.random() * 100) % (possible.length)
        changeS(possible[idx])
    }

    return(
        <div>
            <p>{s}</p>
            <button onClick={onClick}>Change S!!</button>
        </div>
    )
}


export default Test 