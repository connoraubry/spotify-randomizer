

function Filters({updateFilters}) {

    const genres = [
        'rock',
        'pop',
        'rap',
        'country',
        'r&b',
        'alternative rock',
        'jazz'
    ]

    const rows = genres.map((genre, index) => {
        return (
            <div key={index}>
                <label>
                    <input type="checkbox" id={genre} onChange={handleClickCheckbox}></input>
                    {genre}
                </label>
            </div>
        )

    });

    function handleClickCheckbox(event) {
        updateFilters(event.target.id)
    }
    return (
        <div>
            <h3>Filter By Genre</h3>
            Select genres to include in the new playlist. If none are selected, include all.

            {rows}
        </div>
    )
}

export default Filters