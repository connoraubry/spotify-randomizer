import axios from "axios"
import { get_all_tracks } from "./tracks.js"

export async function getPlaylistData(access_token, url, offset, limit) {
    let options  = {
        url: url,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
        params: {
            offset: offset,
            limit: limit
        }
    }
    const result = await axios(options)
    return result.data
}

export async function clearDstPlaylist(access_token, playlist_id) {

    console.log("Get all playlist songs")
    var all_tracks = await get_all_tracks(access_token, playlist_id);

    let uris = []
    for (let i = 0; i < all_tracks.length; i ++){
        uris.push(all_tracks[i].uri)
    }
    const d = deleteTracks(access_token, playlist_id, uris)
    return d
}
export async function deleteTracks(access_token, dst_playlist_id, uris) {

    var url = 'https://api.spotify.com/v1/playlists/' + dst_playlist_id + '/tracks';

    var config = {
        headers: { 'Authorization': 'Bearer ' + access_token },
        data : {
            uris: uris
        }
    }
    return axios.delete(url, config)
}