import { useState, useEffect } from "react";
import Button from "./Button"
import Header from "./Header";
import Userdata from "./Userdata";
import Form from "./Form/Form";

function Body(props) {

    const [userdata, setUserdata] = useState({id: ""})

    useEffect(() => {
        if (userdata.id === ""){
            getUserData();
        }
    }, []);

    async function getUserData() {
        var param = new URLSearchParams({access_token: props.token})
        const response = await fetch("/api/userdata?" + param);
        const json = await response.json();
        console.log(json)
        setUserdata(json.userdata)
    }

    return (
        <div className="Body">
            <Header userdata={userdata}/>
            { (userdata.id === "") ? <div></div> : <Userdata userdata={userdata} />}
            <p>Logged in to spotify!</p>
            <p> {props.token }</p>
            <Button />
            <Form token={props.token} user_id={userdata.id} />
        </div>
    )
}

export default Body 