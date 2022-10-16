import express from 'express'
import axios from 'axios'
import * as playlist_fn from '../handlers/playlists.js'
import * as track_fn from '../handlers/tracks.js'

const api_routes  = express.Router()

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

api_routes.get("/create-playlist", (req, res) => {
    var access_token = req.query.access_token;
    var user_id = req.query.user_id;
    var playlist_name = req.query.playlist_name;

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

api_routes.get("/submit", (req, res) => {
    var access_token = req.query.access_token
    var src_playlist_id = req.query.src_playlist_id
    var dst_playlist_id = req.query.dst_playlist_id

    const v = track_fn.get_ordered_tracks(access_token, src_playlist_id)
    
    const maxRequest = 100;

    //once we get all tracks, ...
    v.then((x) => {

        const t = playlist_fn.clearDstPlaylist(access_token, dst_playlist_id)

        t.then(() => {
            console.log("submitting")
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

export default api_routes