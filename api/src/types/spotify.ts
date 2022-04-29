export type PlayList = {
    external_urls: any,
    href: string,
    id: string,
    images: Array<Image>,
    name: string,
    tracks: TrackList,
    type: string,
    uri: string 
}

export type TrackList = {
    href: string,
    items: Array<TrackListEntry>,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number
}

export type TrackListEntry = {
    added_at: string,
    added_by: any,
    track: Track,
    is_local: boolean
}

export type Track = {
    album: any,
    artists: any,
    duration_ms: number,
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}

export type Image = {
    height: number,
    width: number,
    url: string
}

