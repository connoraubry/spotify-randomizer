import Playlist from "./Playlists"


function Form({token, user_id}) {

    return (
        <div className='medium-container'>
            <Playlist token={token} user_id={user_id}/>
        </div>
    )

}

export default Form