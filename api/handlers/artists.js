import axios from "axios"


export async function get_artist_info(access_token, artist_id) {
    let options = {
        url: 'https://api.spotify.com/v1/artists/' + artist_id,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token }
    }
    const result = await axios(options)
    return result.data
}