import { useState, useEffect } from "react";
import Header from "./Header";
import Form from "./Form/Form";
import Button from "./Button";

function Body(props) {

    const [userdata, setUserdata] = useState({id: ""})

    useEffect(() => {
        if (userdata.id === ""){
            getUserData();
        }
    }, []);

    async function getUserData() {
        var param = new URLSearchParams({access_token: props.token})
        fetch("/api/userdata?" + param)
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setUserdata(json.userdata)
            })
    }

    return (
        <div className="Body">
            <Header userdata={userdata}/>
            <Form token={props.token} user_id={userdata.id} />
            <Button token={props.token}/>
        </div>
    )
}

export default Body 