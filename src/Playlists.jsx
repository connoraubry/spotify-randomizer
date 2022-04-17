import React, { useState, useEffect } from 'react';
import axios from 'axios'



const PlaylistHeader = () => {
    return (
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Songs</th>
                <th>Id</th>
            </tr>
        </thead>      
    )
}

function PlaylistRows ({items}) {
    const rows = items.map((playlist, index) =>{
        return (
            <tr key={index}> 
                <td>
                    <button className='muted-button'>
                        <div className='flex-row'>
                            <div className='flex-small one-fourth'>
                                <img src={playlist.images[0].url}
                                    height="100" width="100"></img>
                            </div>
                            <div className='flex-large vertical-center'>{playlist.name}</div>

                        </div>

                    </button>

                </td>
                <td>{playlist.name}</td>
                <td>{playlist.tracks.total}</td>
                <td>{playlist.id}</td>
            </tr>
        )
    })

    return (
        <tbody>{rows}</tbody>
    )

}

function PlaylistTable({playlist}) {
    return (
        <table>
            <PlaylistHeader />
            <PlaylistRows items={playlist.items} />
        </table>
    )
}


function PlayListList({playlists}) {

    const rows = playlists.items.map((playlist, index) => {
        return (
            <div key={index}>
                <button className='muted-button full-button'>
                    <div className='flex-row'>
                        <div className='flex-small one-third'>
                            <img src={playlist.images[0].url} height='100' width='100'></img>
                        </div>
                        <div className='flex-small vertical-center'>{playlist.name}</div>
                    </div>
                </button>
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

    function onClick() {
        console.log("Button clicked!")

        console.log("Pinging " + url)

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

    return(
        <section id="playlist">
            <article>
                <button onClick={onClick}>Get Playlists</button>
                <PlayListList playlists={playlist} />
            </article>
        </section>
    )
    
}

export default Playlist