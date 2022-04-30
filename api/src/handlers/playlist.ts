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



export {responseToPlaylist, getPlaylist}