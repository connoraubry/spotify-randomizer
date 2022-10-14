import express from 'express'

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
    // use the access token to access the Spotify Web API
    axios(options)
        .then((response) => {
            res.json({userdata: response.data})
        })
})

export default api_routes