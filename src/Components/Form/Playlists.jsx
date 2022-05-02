import React, { useState, useEffect } from 'react';
import axios from 'axios'



function ButtonWithImage({index, name, image_url, clickFunction, isSelected=false}) {


    var img; 
    if (image_url != null) {
        img = <img  src={image_url} height='100' width='100'></img>
    } else {
        img  = <div></div>
    }
    var classType = isSelected ? 'button' : 'muted-button';
    classType  = classType + " full-button"
    return (
        <button className={ classType }  onClick={e => clickFunction(index)}>
            <div className='flex-row'>
                <div  className='flex-small one-third'>
                    {img}
                </div>
                <div className='flex-small vertical-center'>{name}</div>
            </div>
        </button>
    )
}


function PlayListSongs({tracks, songClick}) {

    const rows = tracks.items.map((track_info, index) => {
        var track = track_info.track
        var album = track.album

        var image_url = null;
        if (album.images.length > 1) {
            let image = album.images[1]
        
            if ('url' in image){
                image_url = image.url
            }
        }
        if (album.images.length > 0) {
            let image = album.images[0]
            if ('url' in image) {
                image_url = image.url
            }
        }

        return (
            <div key={index}>
                <ButtonWithImage index={index} name={track.name}
                    image_url={image_url} clickFunction={songClick} />
            </div>
        )
    });
    return (
        <div>
            {rows}
        </div>
    )
}




function PlayListList({playlists, playlistClick, matchString, selectedID}) {

    const rows = playlists.items.map((playlist, index) => {
        let image_url = null;


        let name = playlist.name.toLowerCase()
        let result = name.includes(matchString)

        let isSelected = playlist.id == selectedID

        if (result) {
            //get image 
            if (playlist.images.length > 1) {
                let image = playlist.images[1]
            
                if ('url' in image){
                    image_url = image.url
                }
            }
            if (playlist.images.length > 0) {
                let image = playlist.images[0]
                if ('url' in image) {
                    image_url = image.url
                }
            }
            return (
                <div key={index}>
                    <ButtonWithImage index={index} name={playlist.name} 
                            image_url={image_url} clickFunction={playlistClick} isSelected={isSelected}  />
                </div>
            )
        }

    });
    return (
        <div>
            {rows}
        </div>
    )
}


function PlInput({playlists, inputClick, playlistClick, input, setInput, selectedID}) {

    //state is typed text 
    function handleChange(event) {
        const {_, value} = event.target
        setInput(value)
    }

    return (
        <div>
            <input type="text" 
                name="playlistSelector"
                value={input}
                onChange={handleChange}
                onClick={inputClick}
                placeholder="Enter playlist name..."
            />

            <div className='flex-row scroll-div' >
                <PlayListList playlists={playlists} 
                    playlistClick={playlistClick} 
                    matchString={input}
                    selectedID={selectedID} />
            </div>
        </div>

    )
}


function Playlist ({user_id, token, playlistID, setPlaylistID, playlists, setPlaylists, getAllPlaylists}) {

    // const [playlists, setPlaylists] = useState({
    //     'items': []
    // })

    const [input, setInput] = useState("")

    function onClick() {
        if (playlists.items.length == 0){
            getAllPlaylists()
        }
    }


    function playlistClick(playlistKey){ 
        let currPlaylistID = playlists.items[playlistKey].id
        console.log(currPlaylistID)
        if (playlistID == currPlaylistID) {
            console.log("Setting to null")
            setPlaylistID("")
        } else { 
            console.log("Setting to val")
            setPlaylistID(currPlaylistID)
            axios.get('/api/get-playlist-tracks', {
                params: {
                    access_token: token,
                    playlist_id: currPlaylistID
                }
            })
                .then(function(response) {
                    console.log(response)
                })
        }

    }

    return(
        <section id="playlist">
            <article>
                {/* <button onClick={onClick}>Get Playlists</button> */}
                <div>
                    <PlInput playlists={playlists} 
                        inputClick={onClick}
                        playlistClick={playlistClick} 
                        input={input} setInput={setInput} selectedID={playlistID}/>
                </div>

            </article>
        </section>
    )
    
}

export default Playlist