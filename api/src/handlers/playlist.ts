import '../types/spotify'
import { PlayList, PlaylistQuery } from '../types/spotify'
import axios from 'axios'

function responseToPlaylist(data: any): PlayList {

    var testVar = data as PlayList
    return testVar
}

function getPlaylist(access_token: any, playlist_id: any): PlaylistQuery {
    var options : any = {
        url: 'https://api.spotify.com/v1/me/playlists' + playlist_id,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token }
    };
    // use the access token to access the Spotify Web API

    

    axios(options)
        .then((response) => {
            let ps = response.data as PlayList
            return {error: false, playlist: ps}; 
        })
        .catch((reason) => {
            console.log(reason)
            return {error: true, error_reason: reason}; 
        })
    return { error: true }  as PlaylistQuery 
}



// function createOptions(access_token: string, playlist_id: string, offset: number, limit: number) {
//     return {
//         url: 'https://api.spotify.com/v1/me/playlists' + playlist_id + '/tracks',
//         method: 'GET',
//         headers: { 'Authorization': 'Bearer ' + access_token },
//         params: {
//             offset: offset,
//             limit: limit
//         }
//     }
// }


// function querySongs(query: any) {
//     axios(query)
//         .then()
// }

// function getAllSongsFromAPlaylist(access_token, playlist_id, playlistMax: number) {

//     let increment = 50;
//     let offset = 0;

//     var tracks = []

//     while (offset < playlistMax) { 


//         offset += increment;
//     }


//     var options : any = {
//         url: 'https://api.spotify.com/v1/me/playlists' + playlist_id,
//         method: 'GET',
//         headers: { 'Authorization': 'Bearer ' + access_token }
//     };
// }



export {responseToPlaylist, getPlaylist}