import { useState, useEffect } from "react";
import Button from "./Button"

function Body(props) {

    const [userdata, setUserdata] = useState({})

    useEffect(() => {
        if (userdata.id == "")
            getUserData();
    
    }, []);

    async function getUserData() {
        const response = await fetch("/auth/userdata");
        const json = await response.json();
        console.log(json)
        setUserdata(json.userdata)

    }


    return (
        <div className="Body">
            <p>Logged in to spotify!</p>
            <p> {props.token }</p>
            <Button />
        </div>
    )
}

export default Body 