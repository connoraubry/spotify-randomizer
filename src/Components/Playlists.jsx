import React, { useState, useEffect } from 'react';
import axios from 'axios'



function ButtonWithImage({index, name, image_url, clickFunction}) {


    var img; 
    if (image_url != null) {
        img = <img  src={image_url} height='100' width='100'></img>
    } else {
        img  = <div></div>
    }

    return (
        <button className='muted-button full-button' onClick={e => clickFunction(index)}>
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

function PlayListList({playlists, playlistClick}) {

    const rows = playlists.items.map((playlist, index) => {
        var image_url = null;
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
                        image_url={image_url} clickFunction={playlistClick}  />
            </div>
        )
    });
    return (
        <div>
            {rows}
        </div>
    )
}

function Playlist ({url, user_id, token, dataType}) {


    const [playlists, setPlaylists] = useState({
        'items': []
    })

    const [tracks, setTracks] = useState({
        'items': [],
        'limit': 0,
        'offset': 0,
        'total': 0,
    })

    function onClick() {
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


    function playlistClick(playlistKey){ 
        var playlistID = playlists.items[playlistKey].id
        axios.get('/api/playlist-songs', {
            params: {
                access_token: token,
                playlist_id: playlistID
            }
            })
            .then(function (response){
                console.log(response)
                setTracks(response.data.songs.tracks)
            })
    }
    function songClick(songKey){
        console.log(tracks.items[songKey])
    }

    return(
        <section id="playlist">
            <article>
                <button onClick={onClick}>Get Playlists</button>
                <div className='flex-row'>
                    <div className='flex-small half'>
                        <PlayListList playlists={playlists} playlistClick={playlistClick} />
                    </div>
                    <div className='flex-small half'>
                        <PlayListSongs tracks={tracks} songClick={songClick} />
                    </div>
                </div>
            </article>
        </section>
    )
    
}

export default Playlist