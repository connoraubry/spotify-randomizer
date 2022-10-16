import React from 'react';

function Userdata ({userdata}) {

    return(
        <div>
            <dl className="dl-horizontal">
                <dt>Display name</dt><dd className="clearfix">{userdata.display_name}</dd>
                <dt>Id</dt><dd>{userdata.id}</dd>
                <dt>Email</dt><dd>{userdata.email}</dd>
                <dt>Spotify URI</dt><dd><a href="{userdata.external_urls.spotify}">{userdata.external_urls.spotify}</a></dd>
                <dt>Country</dt><dd>{userdata.country}</dd>
            </dl>  
        </div>
    )
}


export default Userdata 