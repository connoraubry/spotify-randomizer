import express from "express";
import dotenv from "dotenv"
import {URLSearchParams} from "url"
import axios from "axios";
import cors from "cors";
import {test_fn} from "./randomizer/index";
import {getPlaylist, responseToPlaylist} from "./handlers/playlist";

const app = express();
app.use(cors())

var access_token = "";

dotenv.config()

const spotify_client_id : string = process.env.SPOTIFY_CLIENT_ID || ""
const spotify_client_secret : string = process.env.SPOTIFY_CLIENT_SECRET || ""
const port : number = parseInt(process.env.SPOTIFY_PORT || "5005")
var spotify_redirect_uri = 'http://localhost:3000/api/auth/callback'

export const generateRandomString = (length: number) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


app.get('/api/test', (_, res) => {
    res.json({
        'test': generateRandomString(16),
        'client id': spotify_client_id,
        'spotify_secret': spotify_client_secret,
        'redirect_uri': spotify_redirect_uri,
        'access_token': access_token
    })
})

app.get('/api/auth/login', (_, res) => {
    var scope = "user-read-email user-read-private user-top-read playlist-read-private"
    var state = generateRandomString(16);
  
    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state     
    })

    console.log(auth_query_parameters.toString())
  
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})


app.get('/api/auth/callback', (req, res) => {


    var code = req.query.code;

    var requestConfig : any = {
        url: "https://accounts.spotify.com/api/token",
        method: 'POST',
        params: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: "authorization_code"
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    }

    axios(requestConfig)
        .then((response) => {
            // tslint:disable-next-line:no-console
            console.log(response)
            access_token = response.data.access_token

            res.redirect('/')
        })
        .catch((err) => {
            console.log('ERR GETTING SPOTIFY ACCES TOKEN', err)
        })
})

app.get('/api/auth/token', (_, res) => {
    console.log("auth token")
    res.json({ access_token: access_token})
})

// define a route handler for the default home page
app.get("/", ( _, res ) => {
    res.send( "Hello world! Test 2" );
} );

app.get("/api/userdata", (req, res) => {
    console.log('userdata')
    var access_token = req.query.access_token

    var options : any = {
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

app.get("/api/playlists", (req, res) => {
    var access_token = req.query.access_token

    var options : any = {
      url: 'https://api.spotify.com/v1/me/playlists',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token }
    };
    // use the access token to access the Spotify Web API
    axios(options)
        .then((response) => {
            console.log(response)
            res.json({playlists: response.data})
        })
})


app.get("/api/playlist-songs", (req, res) => {
    var access_token = req.query.access_token
    var playlist_id = req.query.playlist_id
    console.log(playlist_id)
    var options : any = {
        url: 'https://api.spotify.com/v1/playlists/' + playlist_id,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
        params: {
            limit: 50,
            offset: 1000
        }
    };
    // use the access token to access the Spotify Web API
    axios(options)
        .then((response) => {
            try {
                let playlist = responseToPlaylist(response.data)
                console.log("success")
                res.json({songs: playlist})
            } catch {
                console.log("error")
                res.json({songs: response.data})

            }
        })
})

app.get("/api/playlist-tset", (req, res) => {
    var access_token = req.query.access_token 
    var playlist_id = req.query.playlist_id
    var ps = getPlaylist(access_token, playlist_id)
    res.json({songs: ps})
})


app.get("/api/test/request", (req, res) => {
    console.log("ENTERING TEST REQUEST")
    console.log(req.query.offset)
    res.json({"good": true})
})

app.get("/api/test2", (_req, res) => {
    console.log("ENTERING TEST2")
    console.log(test_fn())
    res.json({good: true})
    
})

app.get("/api/get-all-playlists", (req, res) => {

    var access_token = req.query.access_token
    var user_id = req.query.user_id 

    const limit = 50 

    let url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists'

    var playlistData  = getPlaylistData(access_token, url, 0, limit);

    //one request, gives us first 50 and Flength 

    var playlists: any[] = []

    playlistData.then((data) => {


        playlists.push(...data.items)

        let promises : any[] = [];

        for (let i = data.limit; i < data.total; i += data.limit) {
            let promise = getPlaylistData(access_token, url, i, limit)

            promises.push(promise)
            promise.then((innerData) => {
                playlists.push(...innerData.items)
            })
            promises.push(getPlaylistData(access_token, url, i, limit))
        }
        
        Promise.all(promises)
            .then(() => {
                console.log("promises")
                res.json({"playlists": playlists})
            })
            .catch((e) => {
                console.log(e)
            })
    })
})


async function getPlaylistData(access_token: any, url: any, offset: number, limit: number) {
    let options : any = {
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



// function getPD(access_token: any, url: any, offset: number, limit: number) {

//     let options : any = {
//         url: url,
//         method: 'GET',
//         headers: { 'Authorization': 'Bearer ' + access_token },
//         params: {
//             offset: offset,
//             limit: limit
//         }
//     }
//     axios(options).then((result) => {
//         return result.data
//     })
// }
// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

