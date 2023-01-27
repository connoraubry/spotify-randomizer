import { useState } from "react";

function Button({token}){
    const [text, setText] = useState("")

    function buttonFn() {
        console.log('hello')
        setText("hi")
        var params = new URLSearchParams({access_token: token, 
            artist_id: "51Blml2LZPmy7TTiAg47vQ"})
        fetch("/api/artist?" + params)
            .then((response) => response.json())
            .then((json) => console.log(json))
    }

    return (
        <div className="Button">
            <p>{ text }</p>
            <button onClick={ buttonFn }>Debug Button</button>
        </div>
    )
}

export default Button