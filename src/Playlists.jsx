import React, { useState, useEffect } from 'react';
import axios from 'axios'



function ButtonWithImage({index, name, image_url, clickFunction}) {
    return (
        <button className='muted-button full-button' onClick={e => clickFunction(index)}>
            <div className='flex-row'>
                <div  className='flex-small one-third'>
                    <img  src={image_url} height='100' width='100'></img>
                </div>
                <div className='flex-small vertical-center'>{name}</div>
            </div>
        </button>
    )
}


function PlayListSongs({tracks, songClick}) {
    console.log("Playlist tracks:")
    console.log(tracks)
    const rows = tracks.items.map((track_info, index) => {
        var track = track_info.track
        var album = track.album
        console.log(track_info, index, track, album)
        return (
            <div key={index}>
                <ButtonWithImage index={index} name={track.name}
                    image_url={album.images[0].url} clickFunction={songClick} />
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
        return (
            <div key={index}>
                <ButtonWithImage index={index} name={playlist.name} 
                        image_url={playlist.images[0].url} clickFunction={playlistClick}  />
            </div>
        )
    });
    return (
        <div>
            {rows}
        </div>
    )
}

function Playlist ({url, token, dataType}) {

    const [playlist, setData] = useState({
        'items': [],
        'href': "",
        'limit': 0,
        'offset': 0,
        'total': 0,
        'previous': null,
        'next': null
    });
    const [tracks, setTracks] = useState({
        'items': [],
        'limit': 0
    })

    function onClick() {
        axios.get(url, {
            params: {
                access_token: token
            }
            })
          .then(function (response){
              console.log(response.data)
              setData(response.data.playlists)
          })
    }


    function playlistClick(playlistKey){ 
        var playlistID = playlist.items[playlistKey].id
        axios.get('/auth/playlist-songs', {
            params: {
                access_token: token,
                playlist_id: playlistID
            }
            })
            .then(function (response){
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
                        <PlayListList playlists={playlist} playlistClick={playlistClick} />
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