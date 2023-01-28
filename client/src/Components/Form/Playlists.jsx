import React, { useState } from 'react';

function ButtonWithImage({index, name, image_url, clickFunction, isSelected=false}) {


    var img; 
    if (image_url != null) {
        img = <img  src={image_url} height='80' width='80' alt='album'></img>
    } else {
        img  = <div></div>
    }
    var classType = isSelected ? 'accent-button' : 'muted-button';
    classType  = classType + " full-button"
    return (
        <div className='flex-small  full-container'>
            <button className={ classType }  onClick={e => clickFunction(index)}>
                <div className='flex-row'>
                    <div  className='flex-small one-third'>
                        {img}
                    </div>
                    <div className='flex-small vertical-center'>{name}</div>
                </div>
            </button>
        </div>
    )
}



function PlayListList({playlists, 
                playlistClick, 
                matchString, selectedID}) {

    const rows = playlists.map((playlist, index) => {
        let image_url = null;

        let name = playlist.name.toLowerCase()
        let result = name.includes(matchString)

        let isSelected = playlist.id === selectedID

        if ((selectedID === "" && result) || (selectedID !== "" && isSelected)) {
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
                            image_url={image_url} 
                            clickFunction={playlistClick} 
                            isSelected={isSelected}  />
                </div>
            )
        }
        return 
    });

    var newRows = rows.filter((element) => {return element !== undefined})

    var multi = (
        <div className='flex-row'>
            <div className='flex-large '>
                {newRows.filter((element, index) => {return index % 2 === 0 })}
            </div>
            <div className='flex-large '> 
                {newRows.filter((element, index) => {return index % 2 === 1 })}
            </div>
        </div>
    )
    var few = (
        <div className='flex-large'>
            {newRows}
        </div>
    )
    if (newRows.length <= 5){
        return few
    } else {
        return multi
    }
}


function PlInput({playlists, 
        // inputClick, 
        playlistClick, 
        input, setInput, selectedID}) {

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
                // onClick={inputClick}
                placeholder="Enter playlist name..."
            />

            <div className='flex-row scroll-div ' >
                <PlayListList playlists={playlists} 
                    playlistClick={playlistClick} 
                    matchString={input}
                    selectedID={selectedID} />
            </div>
        </div>

    )
}


function Playlist ({user_id, token, playlistID, setPlaylistID, playlists, setPlaylists, getAllPlaylists}) {


    const [input, setInput] = useState("")

    // useEffect(() =>{
    //     if (playlists.length === 0){
    //         getAllPlaylists()
    //     }
    // }, []);


    function playlistClick(playlistKey){ 
        let currPlaylistID = playlists[playlistKey].id
        console.log(currPlaylistID)
        if (playlistID === currPlaylistID) {
            console.log("Setting to null")
            setPlaylistID("")
        } else { 
            console.log("Setting to val")
            setPlaylistID(currPlaylistID)
            var params = new URLSearchParams({access_token: token, 
                            playlist_id: currPlaylistID})
            fetch('/api/get-playlist-tracks?' + params)
                .then((response) => response.json())
                .then((json) => console.log(json))
                
        }

    }

    return(
        <div>
            <h3>Select A Source Playlist</h3>
            <div className="flex-row">
                <div className="flex-small three-fourths">
                    <section id="playlist">
                        <article>
                            <div>
                                <PlInput playlists={playlists} 
                                    playlistClick={playlistClick} 
                                    input={input} setInput={setInput} selectedID={playlistID}/>
                            </div>
                        </article>
                    </section>
                </div>
                <div className="flex-small">
                    <button onClick={getAllPlaylists} className='full-button' >Load playlists</button>
                </div>
            </div>
        </div>
    )
    
}

export default Playlist