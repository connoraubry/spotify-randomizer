import axios from "axios"
export function test_fn() : string {
    return "This is a return message"
}


function compare(track1: any, track2: any) { 
    if (track1.duration_ms < track2.duration_ms){
        return -1;
    }
    if (track2.duration_ms < track1.duration_ms){
        return 1;
    }
    return 0;
}


export async function get_ordered_tracks(access_token: any, playlist_id: any) {

    var all_tracks = await get_all_tracks(access_token, playlist_id);
    all_tracks.sort(compare)
    return all_tracks
}



export async function get_all_tracks(access_token: any, playlist_id: any) {
    const first = await get_first_tracks(access_token, playlist_id)
    var items : any[] = []

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




async function get_first_tracks(access_token : any, playlist_id : any) {
    console.log("Get first playlist songs")
    const limit = 50 
    let fields = "total,items(track(duration_ms,id,name))"

    return getPlaylistTrack(access_token, playlist_id, 0, limit, fields);
}

async function get_all_tracks_promises(
                access_token : any, 
                playlist_id : any,
                total: number){ 

    console.log("Get all playlist songs")
    const limit = 50 

    var promises : any[] = [];

    for (let i = limit; i < total; i += limit) {
        let promise = getPlaylistTrack(access_token, playlist_id, i, limit)
        promises.push(promise)
    }
    return Promise.all(promises)
}

async function getPlaylistTrack(access_token: any, 
        playlist_id: any, 
        offset: number, 
        limit: number, 
        fields: string = "items(track(duration_ms,id,name))") {

    let options : any = {
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