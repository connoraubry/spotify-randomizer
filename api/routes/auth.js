import express from 'express'
import axios from 'axios'

import { client_id, client_secret } from '../config.js'

var redirect_uri = 'http://localhost:3000/auth/callback'; // Your redirect uri

const auth_routes  = express.Router()

var access_token = "";
var refresh_token = "";
var stateKey = 'spotify_auth_state';


var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

auth_routes.get('/login', (_, res) => {
    console.log("auth login request made")
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = "user-read-email user-read-private user-top-read playlist-read-private playlist-modify-public playlist-modify-private"

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state     
    })
    console.log("redirecting")
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

auth_routes.get('/callback', (req, res) => {

    console.log("Callback hit")
    var code = req.query.code || null;


    var axiosConfig = {
        url: "https://accounts.spotify.com/api/token",
        method: 'POST',
        params: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: "authorization_code"
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    }
    console.log("fetching api token")
    axios(axiosConfig)
        .then((response) => {
            access_token = response.data.access_token;
            refresh_token = response.data.refresh_token;
            res.redirect('/')
        })
        .catch((err) => {
            console.log("Error getting spotify access token", err)
        });
    
});

auth_routes.get('/token', (_, res) => {
    res.json(
        {
            access_token: access_token
        }
    )
})

export default auth_routes