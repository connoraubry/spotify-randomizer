import fs from 'fs';

const cache_filepath = "files/cache.json"

export function load_cache_file() {
    let rawdata = fs.readFileSync(cache_filepath)
    return JSON.parse(rawdata)  
}

export function mass_update_cache_file(JSON_Data, object) {
    JSON_Data = {...JSON_Data, ...object}
    fs.writeFile(cache_filepath, JSON.stringify(JSON_Data), err => {
        if (err) {
            console.error(err)
        }
    })
    return JSON_Data
}