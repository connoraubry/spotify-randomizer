import Playlist from "./Playlists"
import React, { useState } from 'react';

function Destination({newPlaylistName, handleChange, buttonClick, dstPlaylistID}) {

    let buttonClass = (dstPlaylistID === "") ? "button" : "accent-button"
    let classes = `${buttonClass} full-button`
    return (
        <div>
            <h3>Select A Destination Playlist</h3>
            <div className="flex-row">
                <div className="flex-small three-fourths">
                    <input type="text" 
                        name="newPlaylist"
                        value={newPlaylistName}
                        onChange={handleChange}
                        placeholder="Enter new playlist name"
                    />
                </div>
                <div className="flex-small">
                    <button onClick={buttonClick} className={classes}>Overwrite playlist</button>
                </div>
            </div>
        </div>
    )
}

function Submission({finalSubmit, errorString, name}) {
    return (
        <div className="small-container">
            <div className="flex-row">
                <div className="flex-small one-fourth"></div>
                <div className="flex-small one-half">
                    <button onClick={finalSubmit} className="full-button">{name}</button>
                </div>
                <div className="flex-small one-fourth" />
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



    function testArtist(){
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
                // .then((error) => console.error(error))
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
                .catch((error) => setErrorString(error))
        }
    }

    function handleChange(event) {

        setNewPlaylistName(event.target.value)
        setDstPlaylistID("")
    }

    return (
        <div className='medium-container'>
            <Playlist user_id={user_id} token={token} playlistID={srcPlaylistID} setPlaylistID={setSrcPlaylistID}
                playlists={playlists} setPlaylists={setPlaylists} getAllPlaylists={getAllPlaylists} />


            <Destination newPlaylistName={newPlaylistName} handleChange={handleChange}
                buttonClick={buttonClick} dstPlaylistID={dstPlaylistID} />

            <h3>Submit</h3>
            {/* <Submission finalSubmit={finalSubmit} errorString={errorString} name="Generate Playlist"/> */}
            <Submission finalSubmit={testArtist} errorString={errorString} name="Generate Playlist"/>
        </div>
    )

}

export default Form