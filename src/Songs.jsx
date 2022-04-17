import React, { useState, useEffect } from 'react';
import axios from 'axios'


function SongsList({songs}) {

    const rows = songs.items.map((song, index) => {
        return (
            <div key={index}>
                <button className='muted-button full-button'>
                    <div className='flex-row'>
                        <div className='flex-small one-third'>
                            <img src={song.album.images[0].url} height='100' width='100'></img>
                        </div>
                        <div className='flex-small vertical-center'>
                            {song.name}
                        </div>
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

function Songs ({url, token, dataType}) {

    const [songs, setData] = useState({
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
              setData(response.data.songs)
          })

    }

    return(
        <section id="songs">
            <article>
                <button onClick={onClick}>Get Top Songs</button>
                <SongsList songs={songs} />
            </article>
        </section>
    )
    
}

export default Songs