const express = require('express')
const request = require('request');
const dotenv = require('dotenv');

const port = 5000

global.access_token = ''

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get('/auth/test', (req, res) => {
  res.json({'test': 'succeeded'})
})

app.get('/auth/login', (req, res) => {

  var scope = "user-read-email user-read-private user-top-read playlist-read-private"
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', (req, res) => {

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/')
    }
  });

})

app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token})
})

app.get('/auth/userdata', (req, res) => {

  var access_token = req.query.access_token

  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  // use the access token to access the Spotify Web API
  request.get(options, function(error, response, body) {
    res.json({userdata: body})
  });
})

app.get('/auth/playlists', (req, res) => {
  var access_token = req.query.access_token

  var options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 'Authorization': 'Bearer ' + access_token},
    json: true
  };
  request.get(options, function(error, response, body) {
    res.json({playlists: body})
  })
})

app.get('/auth/top-songs', (req, res) => {
  var access_token = req.query.access_token

  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: { 'Authorization': 'Bearer ' + access_token},
    json: true
  };
  request.get(options, function(error, response, body) {
    res.json({songs: body})
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})