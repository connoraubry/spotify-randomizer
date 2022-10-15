// import Playlist from "./Playlists"
import React, { useState } from 'react';

// function Destination({newPlaylistName, handleChange, buttonClick, dstPlaylistID}) {

//     let buttonClass = (dstPlaylistID == "") ? "button" : "accent-button"

//     return (
//         <div className="flex-row">
//             <div className="flex-small two-thirds">
//                 <input type="text" 
//                     name="newPlaylist"
//                     value={newPlaylistName}
//                     onChange={handleChange}
//                     placeholder="Enter new playlist name"
//                 />
//             </div>
//             <div className="flex-small">
//                 <button onClick={buttonClick} className={buttonClass}>Use This Playlist (Will be overwritten)</button>
//             </div>
//         </div>
//     )

// }

// function Submission({finalSubmit, errorString}) {

//     return (
//         <div className="small-container">
        
//             <div className="flex-row">
//                 <div className="flex-small one-third"></div>
//                 <div className="flex-small one-third">
//                     <button onClick={finalSubmit} className="full-button">Generate Playlist</button>

//                 </div>
//             </div>
//             <div className="flex-row">
//                 <div className="flex-small one-third"></div>
//                 <div className="flex-small one-third">
//                     <p>{errorString}</p>

//                 </div>
//             </div>
//         </div>
//     )
// }




function Form({token, user_id}) {

    const [playlists, setPlaylists] = useState({
        'items': []
    })

    const [newPlaylistName, setNewPlaylistName] = useState("test-create")
    const [srcPlaylistID, setSrcPlaylistID] = useState("")
    const [dstPlaylistID, setDstPlaylistID] = useState("")
    const [errorString, setErrorString] = useState("")



    // function finalSubmit(){
    //     if (srcPlaylistID != "" && dstPlaylistID != ""){
    //         axios.get("/api/submit", {
    //             params: {
    //                 access_token: token,
    //                 src_playlist_id: srcPlaylistID,
    //                 dst_playlist_id: dstPlaylistID
    //             }
    //         })
    //             .then((response) => {
    //                 console.log(response)
    //             })
    //     } else {
    //         console.log("Bad req:", srcPlaylistID, dstPlaylistID)
    //     }
    // }

    // async function getUserData() {
    //     var param = new URLSearchParams({access_token: props.token})
    //     const response = await fetch("/api/userdata?" + param);
    //     const json = await response.json();
    //     console.log(json)
    //     setUserdata(json.userdata)
    // }

    async function getAllPlaylists() {
        var params = new URLSearchParams({access_token: token, user_id: user_id})
        fetch('/api/get-all-playlists?' + params)
            .then(async (response) => {
                const data = await response.json()
                console.log(data)
                // setPlaylists({'items': response.data.playlists})
            })
    }


    // function newPlaylistNameId() {
    //     for (let i = 0; i < playlists.items.length; i ++){
    //         if (newPlaylistName == playlists.items[i].name){
    //             return playlists.items[i].id
    //         }
    //     }
    //     return "" 
    // }

    // function buttonClick() {
    //     setDstPlaylistID("")

    //     let id = newPlaylistNameId()
    //     if (id != "") {
    //         setDstPlaylistID(id)
    //         console.log('exists', id)
    //     } else {
    //         axios.get('/api/create-playlist', {
    //             params: {
    //                 access_token: token,
    //                 playlist_name: newPlaylistName,
    //                 user_id: user_id
    //             }
    //         }).then((response) => {
    //             setDstPlaylistID(response.data.id)
    //         })
    //     }
    // }

    // function handleChange(event) {
    //     const {_, value} = event.target
    //     setNewPlaylistName(value)
    //     setDstPlaylistID("")
    // }

    return (
        <div className='medium-container'>
            <h3>Source playlist</h3>
            <button onClick={getAllPlaylists} >Load playlists</button>
            {/* <Playlist user_id={user_id} token={token} playlistID={srcPlaylistID} setPlaylistID={setSrcPlaylistID}
                playlists={playlists} setPlaylists={setPlaylists} getAllPlaylists={getAllPlaylists} /> */}
            {/* <h3>Destination Playlist</h3>
            <Destination newPlaylistName={newPlaylistName} handleChange={handleChange}
                buttonClick={buttonClick} dstPlaylistID={dstPlaylistID} />
            <Submission finalSubmit={finalSubmit} errorString={errorString}/> */}

        </div>
    )

}

export default Form