import express from 'express'
import axios from 'axios'
import { client_id, client_secret } from '../config.js'
const api_routes  = express.Router()

api_routes.get("/test", (_, res) => {
    var test_message = process.env.DOTENV_TEST_VAL || 'dotenv not working'
    console.log("test route reached")
    res.json({
        "text": test_message,
        "client_id": client_id,
        "client_secret": client_secret
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

api_routes.get("/get-all-playlists", (req, res) => {

    console.log("Get all playlists")

    var access_token = req.query.access_token
    var user_id = req.query.user_id 

    const limit = 50 

    let url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists'

    var playlistData  = getPlaylistData(access_token, url, 0, limit);

    //one request, gives us first 50 and Flength 

    var playlists = []

    playlistData.then((data) => {


        playlists.push(...data.items)

        let promises  = [];

        for (let i = data.limit; i < data.total; i += data.limit) {
            let promise = getPlaylistData(access_token, url, i, limit)

            promises.push(promise)
            promise.then((innerData) => {
                playlists.push(...innerData.items)
            })
        }
        
        Promise.all(promises)
            .then(() => {
                //console.log("promises")
                res.json({"playlists": playlists})
            })
            .catch((e) => {
                console.log(e)
            })
    })
    // let options  = {
    //     url: url,
    //     method: 'GET',
    //     headers: { 'Authorization': 'Bearer ' + access_token },
    //     params: {
    //         offset: 0,
    //         limit: limit
    //     }
    // }
    
    // axios(options)
    //     .then((response) => {
    //         // console.log(response)
    //         res.json({data: response.data})
    // })

})

async function getPlaylistData(access_token, url, offset, limit) {
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

export default api_routes