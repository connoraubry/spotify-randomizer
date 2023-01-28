import express from 'express'
import axios from 'axios'
import fs from 'fs'
import * as playlist_fn from '../handlers/playlists.js'
import * as track_fn from '../handlers/tracks.js'
import * as artist_fn from '../handlers/artists.js'

const api_routes  = express.Router()
let JSON_Data = load_cache_file()

function load_cache_file() {
    let rawdata = fs.readFileSync("files/test.json")
    return JSON.parse(rawdata)  
}

function mass_update_cache_file(object) {
    JSON_Data = {...JSON_Data, ...object}
    fs.writeFile("files/test.json", JSON.stringify(JSON_Data), err => {
        if (err) {
            console.error(err)
        }
    })
}

function update_cache_file(key, value){
    JSON_Data[key] = value
    fs.writeFile("files/test.json", JSON.stringify(JSON_Data), err => {
        if (err) {
            console.error(err)
        }
    })
    
}

api_routes.get("/test", (_, res) => {
    var test_message = process.env.DOTENV_TEST_VAL || 'dotenv not working'
    console.log("test route reached")
    res.json({
        "text": test_message,
        // "client_id": client_id,
        // "client_secret": client_secret
    });
})

api_routes.get("/test_file", (_, res) => {

    console.log(JSON_Data)

    res.json({
        "test": "Hello"
    })
})

api_routes.get("/userdata", (req, res) => {

    var access_token = req.query.access_token

    var options = {
      url: 'https://api.spotify.com/v1/me',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token }
    };
    // res.json({userdata: 'test', options: options})
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

    let url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists'

    var playlistData  = playlist_fn.getPlaylistData(access_token, url, 0, limit);

    var playlists = []

    playlistData.then((data) => {

        playlists.push(...data.items)

        let promises  = [];

        for (let i = data.limit; i < data.total; i += data.limit) {
            let promise = playlist_fn.getPlaylistData(access_token, url, i, limit)

            promises.push(promise)
            promise.then((innerData) => {
                playlists.push(...innerData.items)
            })
        }
        
        Promise.all(promises)
            .then(() => {
                res.json({"playlists": playlists})
            })
            .catch((e) => {
                console.log(e)
            })
    })
})

api_routes.get("/get-playlist-tracks", (req, res) => {
    console.log('Get playlist tracks')
    var access_token = req.query.access_token
    var playlist_id = req.query.playlist_id 


    var firstTrackData = track_fn.getPlaylistTrack(access_token, playlist_id, 
        0, 50)
    
    firstTrackData.then((data) => {
        res.json({'tracks': data.items})
    })
    
})

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

api_routes.post("/test_post", (req, res) => {
    console.log(req.body.access_token)
    res.send('POST request to the homepage')
})

api_routes.post("/submit", (req, res) => {
    var access_token = req.body.access_token
    var src_playlist_id = req.body.src_playlist_id
    var dst_playlist_id = req.body.dst_playlist_id

    const v = track_fn.get_ordered_tracks(access_token, src_playlist_id)
    
    const maxRequest = 100;

    //once we get all tracks, ...
    v.then((x) => {

        const t = playlist_fn.clearDstPlaylist(access_token, dst_playlist_id)

        t.then(() => {
            console.log("submitting")
            console.log(x.length)
            var uris = []
            for (let i = 0; i < Math.min(x.length, maxRequest); i ++) {
                uris.push(x[i].uri)
            }
    
            const p = track_fn.sendAllTracksPromise(access_token, dst_playlist_id, uris);
            p.then((_) => {
                console.log("Done")
            })
            res.json({items: x})
        })
    })
})


api_routes.post("/test_artists", (req, res) => {
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
        while (count < maxRequest && index < x.length) {
            let artist_id = x[index]['artists'][0]['id']
            let exists = Object.keys(JSON_Data).includes(artist_id)
            exists = exists || Object.keys(artists).includes(artist_id)
            //if not in json object or already requested 
            if (exists === false) {
                let promise = artist_fn.get_artist_info(access_token, artist_id)
                artists[artist_id] = promise
                count += 1;
            }
            index += 1;
        }

        // for (let i = 0; i < Math.min(maxRequest, x.length); i ++) {
        //     let artist_id = x[i]['artists'][0]['id']

        //     let exists = Object.keys(JSON_Data).includes(artist_id)
        //     exists = exists || Object.keys(artists).includes(artist_id)

        //     //if not in json object or already requested 
        //     if (exists === false) {
        //         let promise = artist_fn.get_artist_info(access_token, artist_id)
        //         artists[artist_id] = promise
        //     }
        // }

        Promise.all(Object.values(artists))
            .then((data) => {
                let keys = Object.keys(artists);
                let update = {}
                for (let i = 0; i < keys.length; i ++){
                    let artist_id  = keys[i]
                    let genres = data[i]['genres']
                    update[artist_id] = genres;
                }
                mass_update_cache_file(update)


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

api_routes.get("/artist", (req, res) => {
    console.log('Get artist')
    var access_token = req.query.access_token
    var artist_id = req.query.artist_id 

    var artistData = artist_fn.get_artist_info(access_token, artist_id)
    
    artistData.then((data) => {
        res.json({'info': data})
    })
    
})
export default api_routes