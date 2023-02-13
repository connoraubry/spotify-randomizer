import express from 'express'
import axios from 'axios'
import * as playlist_fn from '../handlers/playlists.js'
import * as track_fn from '../handlers/tracks.js'
import * as artist_fn from '../handlers/artists.js'
import * as cache_fn from '../handlers/cache.js'

const api_routes  = express.Router()
let JSON_Data = cache_fn.load_cache_file()

api_routes.get("/test", (_, res) => {
    var test_message = process.env.DOTENV_TEST_VAL || 'dotenv not working'
    console.log("test route reached")
    res.json({
        "text": test_message,
        // "client_id": client_id,
        // "client_secret": client_secret
    });
})

api_routes.get("/userdata", (req, res) => {

    var access_token = req.query.access_token

    var options = {
      url: 'https://api.spotify.com/v1/me',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token }
    };

    // use the access token to access the Spotify Web API
    axios(options)
        .then((response) => {
            res.json({userdata: response.data})
        })
})

/*
Gets all playlists of a user. 

Requests for first 50 playlists of a user. IF user has more than 50 playlists, 
send N more requets where N is (NUM_PLAYLISTS-50)/ 50 (request in batches of 50)

Wait for all promises to finish, then return
*/
api_routes.get("/get-all-playlists", (req, res) => {

    console.log("Get all playlists")

    var access_token = req.query.access_token
    var user_id = req.query.user_id 


    const limit = 50 

    //Gets the first 50 playlists + a list of the amount of playlists a user has
    let url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists'
    var playlistData  = playlist_fn.getPlaylistData(access_token, url, 0, limit);

    var playlists = []

    playlistData.then((data) => {

        playlists.push(...data.items)

        let promises  = [];

        //Request playlists 51-N
        for (let i = data.limit; i < data.total; i += data.limit) {
            let promise = playlist_fn.getPlaylistData(access_token, url, i, limit)

            promises.push(promise)
            promise.then((innerData) => {
                playlists.push(...innerData.items)
            })
        }
        
        //Once all requests are in, return list of all playlists 
        Promise.all(promises)
            .then(() => {
                res.json({"playlists": playlists})
            })
            .catch((e) => {
                console.log(e)
            })
    })
})

// api_routes.get("/get-playlist-tracks", (req, res) => {
//     console.log('Get playlist tracks')
//     var access_token = req.query.access_token
//     var playlist_id = req.query.playlist_id 


//     var firstTrackData = track_fn.getPlaylistTrack(access_token, playlist_id, 
//         0, 50)
    
//     firstTrackData.then((data) => {
//         res.json({'tracks': data.items})
//     })
    
// })

api_routes.post("/create-playlist", (req, res) => {
    var access_token = req.body.access_token;
    var user_id = req.body.user_id;
    var playlist_name = req.body.playlist_name;

    var options = {
        headers: { 'Authorization': 'Bearer ' + access_token },
    };
    var url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists';
    var body = {
        name: playlist_name,
        description: "Made with randomizer"
    }
    axios.post(url, body, options)
        .then((response) => {
            res.send(response.data)
        })
})

//TODO: Break up into function
api_routes.post("/submit", (req, res) => {
    var access_token = req.body.access_token
    var src_playlist_id = req.body.src_playlist_id
    var dst_playlist_id = req.body.dst_playlist_id
    var filters = req.body.filters 
    console.log("filters", filters)

    const t = playlist_fn.clearDstPlaylist(access_token, dst_playlist_id)
    const v = track_fn.get_ordered_tracks(access_token, src_playlist_id)

    const maxRequest = 25
    //once we get all tracks, ...
    v.then((x) => {

        let artists = {}
        let count = 0;
        let index = 0;

        //promise block won't run if we have no promises; we have to have at least one (even if all artists are accounted for)
        let at_least_one = false; 

        
        while (count < maxRequest && index < x.length) {
            let artist_id = x[index]['artists'][0]['id']
            let exists = Object.keys(JSON_Data).includes(artist_id)
            exists = exists || Object.keys(artists).includes(artist_id)
            //if not in json object or already requested 

            if (artist_id == null) {
                continue
            }

            if (exists === false || at_least_one == false) {
                let promise = artist_fn.get_artist_info(access_token, artist_id)
                artists[artist_id] = promise
                count += 1;
                at_least_one = true; 
            }
            index += 1;
        }

        Promise.all(Object.values(artists))
            .then((data) => {
                console.log("Success")
                let keys = Object.keys(artists);
                let update = {}
                for (let i = 0; i < keys.length; i ++){
                    let artist_id  = keys[i]
                    let genres = data[i]['genres']
                    update[artist_id] = genres;
                }
                JSON_Data = cache_fn.mass_update_cache_file(JSON_Data, update)


                let final_items = [];

                for (let i = 0; i < x.length; i ++) {
                    let artist_id = x[i]['artists'][0]['id'];
                    
                    if (Object.keys(JSON_Data).includes(artist_id)){
                        let genres = JSON_Data[artist_id]
                        if (should_push_item(genres, filters)){
                            final_items.push(x[i].uri)
                        }
                    }

                }
                console.log("Length of playlist", x.length)
                console.log("Length of request", final_items.length)

                if (final_items.length > 0){
                    const p = track_fn.sendAllTracksPromise(access_token, dst_playlist_id, final_items);
                    p.then((_) => {
                        console.log("Done")
                    })
                } 

            })
    })
    res.sendStatus(202)
})

function should_push_item(genres, filters){
    if (filters.length == 0){
        return true 
    }
    for (var j = 0; j < genres.length; j ++){
        if (filters.includes(genres[j])){
            return true 
        }
    }
    return false 
}

// api_routes.get("/artist", (req, res) => {
//     console.log('Get artist')
//     var access_token = req.query.access_token
//     var artist_id = req.query.artist_id 

//     var artistData = artist_fn.get_artist_info(access_token, artist_id)
    
//     artistData.then((data) => {
//         res.json({'info': data})
//     })
// })
export default api_routes