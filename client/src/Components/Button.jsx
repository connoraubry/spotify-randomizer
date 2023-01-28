import { useState } from "react";

function Button({token}){

    function buttonFn() {
        console.log('hello')
        var params = new URLSearchParams({access_token: token, 
            artist_id: "51Blml2LZPmy7TTiAg47vQ"})
        fetch("/api/test_file?" + params)
            .then((response) => response.json())
            .then((json) => console.log(json))
            .then((error) => console.log(error))
    }

    return (
        <div className="Button">
            <button onClick={ buttonFn }>Debug Button</button>
        </div>
    )
}

export default Button