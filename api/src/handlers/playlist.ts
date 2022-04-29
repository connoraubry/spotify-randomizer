import '../types/spotify'
import { PlayList } from '../types/spotify'

function responseToPlaylist(data: any) {

    var testVar = data as PlayList
    return testVar
}


export default responseToPlaylist