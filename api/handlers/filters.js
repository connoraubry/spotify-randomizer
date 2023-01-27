import * as artist_fn from 'artists.js'


// export async function filter_genres(full_playlist, genres){        
//     let artists = {}

//     //for each unique artist, send a request 
//     for (let i = 0; i < full_playlist.length; i ++) {
//         let artist_id = full_playlist[i]['artists'][0]['id']

//         let exists = Object.keys(artists).includes(artist_id)

//         if (exists === false) {
//             let promise = artist_fn.get_artist_info(access_token, artist_id)
//             artists[artist_id] = promise
//         }
//     }

//     Promise.all(Object.values(artists))
//     .then((data) => {
//         let keys = Object.keys(artists);
//         let final_items = [];

//         for (let i = 0; i < x.length; i ++) {
//             let artist_id = x[i]['artists'][0]['id'];

//             let index = keys.indexOf(artist_id);
//             console.log(data[index]['genres']);

//             let genres = data[index]['genres']
//             for (var j = 0 ; j < genres.length; j++) {
//                 if (filters.includes(genres[j])){
//                     final_items.push(x[i]);
//                     break;
//                 }
//             }
//         }

//         res.json({items: x, final_items: final_items});

//     })
// }
