import Playlist from "./Playlists"
import React, { useState } from 'react';

function Destination({newPlaylistName, handleChange, buttonClick, dstPlaylistID}) {

    let buttonClass = (dstPlaylistID === "") ? "button" : "accent-button"

    return (
        <div className="flex-row">
            <div className="flex-small two-thirds">
                <input type="text" 
                    name="newPlaylist"
                    value={newPlaylistName}
                    onChange={handleChange}
                    placeholder="Enter new playlist name"
                />
            </div>
            <div className="flex-small">
                <button onClick={buttonClick} className={buttonClass}>Use This Playlist (Will be overwritten)</button>
            </div>
        </div>
    )

}

function Submission({finalSubmit, errorString}) {

    return (
        <div className="small-container">
        
            <div className="flex-row">
                <div className="flex-small one-third"></div>
                <div className="flex-small one-third">
                    <button onClick={finalSubmit} className="full-button">Generate Playlist</button>

                </div>
            </div>
            <div className="flex-row">
                <div className="flex-small one-third"></div>
                <div className="flex-small one-third">
                    <p>{errorString}</p>

                </div>
            </div>
        </div>
    )
}




function Form({token, user_id}) {

    const [playlists, setPlaylists] = useState([])

    const [newPlaylistName, setNewPlaylistName] = useState("")
    const [srcPlaylistID, setSrcPlaylistID] = useState("")
    const [dstPlaylistID, setDstPlaylistID] = useState("")
    const [errorString, setErrorString] = useState("")



    function finalSubmit(){
        if (srcPlaylistID !== "" && dstPlaylistID !== ""){
            var options = {
                method: 'POST',
                body: JSON.stringify({
                    access_token: token,
                    src_playlist_id: srcPlaylistID,
                    dst_playlist_id: dstPlaylistID
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            fetch('/api/submit', options)
                .then((response) => response.json())
                .then((json) => console.log(json))
        } else {
            console.log("Bad req:", srcPlaylistID, dstPlaylistID)
        }
    }

    async function getAllPlaylists() {
        var params = new URLSearchParams({access_token: token, user_id: user_id})
        fetch('/api/get-all-playlists?' + params)
            .then(async (response) => {
                const data = await response.json()
                setPlaylists(data.playlists)
            })
    }


    function newPlaylistNameId() {
        for (let i = 0; i < playlists.length; i ++){
            if (newPlaylistName === playlists[i].name){
                return playlists[i].id
            }
        }
        return "" 
    }

    function buttonClick() {
        if (newPlaylistName === ""){
            return 
        }
        setDstPlaylistID("")
        let id = newPlaylistNameId()
        if (id !== "") {
            setDstPlaylistID(id)
            console.log('exists or is none', id)
        } else {
            var options = {
                method: 'POST',
                body: JSON.stringify({
                    access_token: token,
                    playlist_name: newPlaylistName,
                    user_id: user_id
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
            fetch('/api/create-playlist', options)
                .then((response) => response.json())
                .then((json) => setDstPlaylistID(json.id))
        }
    }

    function handleChange(event) {
        const {_, value} = event.target
        setNewPlaylistName(value)
        setDstPlaylistID("")
    }

    return (
        <div className='medium-container'>
            <h3>Source playlist</h3>
            <button onClick={getAllPlaylists} >Load playlists</button>
            <Playlist user_id={user_id} token={token} playlistID={srcPlaylistID} setPlaylistID={setSrcPlaylistID}
                playlists={playlists} setPlaylists={setPlaylists} getAllPlaylists={getAllPlaylists} />
            <h3>Destination Playlist</h3>
            <Destination newPlaylistName={newPlaylistName} handleChange={handleChange}
                buttonClick={buttonClick} dstPlaylistID={dstPlaylistID} />
            <Submission finalSubmit={finalSubmit} errorString={errorString}/>

        </div>
    )

}

export default Form