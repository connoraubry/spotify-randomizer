import axios from "axios"

/*
Get all tracks from a playlist in batches of 50.

1. Get first 50 tracks from playlist.
2. In batches of 50, send requests for teh rest of the playlists
*/ 

export async function get_ordered_tracks(access_token, playlist_id) {

    var all_tracks = await get_all_tracks(access_token, playlist_id);
    // all_tracks.sort(compare)
    return all_tracks

    // return shuffle(all_tracks)
}

export async function get_all_tracks(access_token, playlist_id) {
    const first = await get_first_tracks(access_token, playlist_id)
    var items = []

    for (let i = 0; i < first.items.length; i ++){
        items.push(first.items[i].track)
    }

    const rest = await get_all_tracks_promises(access_token, playlist_id, first.total)

    for (let i = 0; i < rest.length; i ++){
        for (let j = 0; j < rest[i].items.length; j ++){
            items.push(rest[i].items[j].track)
        }
    }
    return items
}
async function get_first_tracks(access_token, playlist_id) {
    // console.log("Get first playlist songs")
    const limit = 50 
    let fields = "total,items(track(duration_ms,id,name,uri))"

    return getPlaylistTrack(access_token, playlist_id, 0, limit, fields);
}

export async function getPlaylistTrack(access_token, playlist_id, 
    offset, limit, fields = "items(track(duration_ms,id,name,uri))") {

    let options = {
        url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
        params: {
            offset: offset,
            limit: limit,
            fields: fields
        }
    }
    const result = await axios(options)
    return result.data
}

async function get_all_tracks_promises(
        access_token, 
        playlist_id,
        total){ 

    console.log("Get all playlist songs")
    const limit = 50 

    var promises = [];

    for (let i = limit; i < total; i += limit) {
    let promise = getPlaylistTrack(access_token, playlist_id, i, limit)
    promises.push(promise)
    }
    return Promise.all(promises)
}


export async function sendAllTracksPromise(access_token, dst_playlist_id, uris, amount = 100) {

    const maxPerRequest = 100
    let sliceAmt = Math.min(maxPerRequest, amount)

    const split = uris.slice(0, sliceAmt);

    let promise = sendTracksPromise(access_token, dst_playlist_id, split)
    promise.catch((reason) => {
        console.log(reason)
    })

    return promise
}
export async function sendTracksPromise(access_token, dst_playlist_id, uris) {

    var url = 'https://api.spotify.com/v1/playlists/' + dst_playlist_id + '/tracks';
    var data = {
        uris: uris
    }

    var config = {
        headers: { 'Authorization': 'Bearer ' + access_token },
    }
    return axios.post(url, data, config)
}