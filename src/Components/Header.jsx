import React from 'react'


const HeaderLogin = (props) => {

    if (props.userdata.display_name !== "") {
        return (
            <div>
                Welcome, {props.userdata.display_name}!
            </div>
        )
    } else { 
        return (
            <div>
                Not currently signed in. 
            </div>
        )
    }
}

function Header(props){

    return (
        <div className='medium-container'>
            <h2>Spofity Randomizer App</h2>
            < HeaderLogin userdata={props.userdata}/>
        </div>
    )

}

export default Header