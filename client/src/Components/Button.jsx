import { useState } from "react";

function Button(){
    const [text, setText] = useState("")

    function buttonFn() {
        console.log('hello')
        setText("hi")
        var options = {
            method: 'POST',            
            body: JSON.stringify({access_token: 12345,}),
            headers: {
                "Content-Type": "application/json"
              }
        }
        fetch("/api/test_post", options)
    }

    return (
        <div className="Button">
            <p>{ text }</p>
            <button onClick={ buttonFn }>Click Me!</button>
        </div>
    )
}

export default Button