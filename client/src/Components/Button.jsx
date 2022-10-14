import { useState } from "react";

function Button(){
    const [text, setText] = useState("")

    function buttonFn() {
        console.log('hello')
        setText("hi")
        fetch("/api/test")
        .then(res => res.json())
        .then(data => setText(data.text))
    }

    return (
        <div className="Button">
            <p>{ text }</p>
            <button onClick={ buttonFn }>Click Me!</button>
        </div>
    )
}

export default Button