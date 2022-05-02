import Playlist from "./Playlists"
import React, { useState } from 'react';
import axios from "axios";

function Destination({newPlaylistName, handleChange, buttonClick }) {

    return (
        <div>
            <input type="text" 
                name="newPlaylist"
                value={newPlaylistName}
                onChange={handleChange}
                placeholder="Enter new playlist name"
            />
            <button onClick={buttonClick}>Create Playlist (Will be overwritten)</button>
        </div>
    )

}

function Subbo({finalSubmit}) {

    return (
        <div>
            <button onClick={finalSubmit}>Append</button>
        </div>
    )
}

function Form({token, user_id}) {

    const [playlists, setPlaylists] = useState({
        'items': []
    })

    const [newPlaylistName, setNewPlaylistName] = useState("")
    const [srcPlaylistID, setSrcPlaylistID] = useState("")
    const [dstPlaylistID, setDstPlaylistID] = useState("")


    const [test, setTest] = useState("")

    function handleChange(event) {
        const {_, value} = event.target
        setNewPlaylistName(value)
    }

    function finalSubmit(){
        if (srcPlaylistID != "" || dstPlaylistID != ""){
            axios.get("/api/submit", {
                params: {
                    access_token: token,
                    src_playlist_id: srcPlaylistID,
                    dst_playlist_id: dstPlaylistID
                }
            })
                .then((response) => {
                    console.log(response)
                })
        } else {
            console.log("Bad req:", srcPlaylistID, dstPlaylistID)
        }
    }

    async function getAllPlaylists() {
        axios.get('/api/get-all-playlists', {
            params: {
                access_token: token,
                user_id: user_id
            }
            })
          .then(function (response){
              console.log(response)
              setPlaylists({'items': response.data.playlists})
          })
    }


    function newPlaylistNameId() {
        for (let i = 0; i < playlists.items.length; i ++){
            if (newPlaylistName == playlists.items[i].name){
                return playlists.items[i].id
            }
        }
        return "" 
    }

    function buttonClick() {
        setDstPlaylistID("")

        let id = newPlaylistNameId()
        if (id != "") {
            setDstPlaylistID(id)
            console.log('exists', id)
        } else {
            axios.get('/api/create-playlist', {
                params: {
                    access_token: token,
                    playlist_name: newPlaylistName,
                    user_id: user_id
                }
            }).then((response) => {
                setDstPlaylistID(response.data.id)
            })
        }
    }

    return (
        <div className='medium-container'>
            <h3>Source playlist</h3>
            <Playlist user_id={user_id} token={token} playlistID={srcPlaylistID} setPlaylistID={setSrcPlaylistID}
                playlists={playlists} setPlaylists={setPlaylists} getAllPlaylists={getAllPlaylists} />
            <h3>Destination Playlist</h3>
            {/* <Playlist token={token} user_id={user_id} playlists={playlists} setPlaylists={setPlaylists}
                playlistID={dstPlaylistID} setPlaylistID={setDstPlaylistID} getAllPlaylists={getAllPlaylists} /> */}
            <Destination newPlaylistName={newPlaylistName} handleChange={handleChange}
                buttonClick={buttonClick} />
            <button onClick={finalSubmit}>Generate Playlist</button>
            {/* <Subbo finalSubmit={finalSubmit} /> */}

        </div>
    )

}

export default Form