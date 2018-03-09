import React from 'react';
import PropTypes from 'prop-types';

import Gif from './Gif';
import Hashtag from './Hashtag'

const TrendingList = props => {

    const giphyResults = props.giphydata;
    let gifs = giphyResults.map(gif => 
        <Gif url={gif.images.fixed_height.url} key={gif.id} />
    );

    const hashtagResults = props.hashtagdata;
    let hashtags = hashtagResults.map(hashtag => 
        <Hashtag name={hashtag.name} key={hashtag.url} />
    );

    return (
        <div>
            <ul>
                {gifs}
                {hashtags}
            </ul>
        </div>
    )
    
}

TrendingList.propTypes = {
    hashtagdata: PropTypes.array.isRequired,
    giphydata: PropTypes.array.isRequired
}

export default TrendingList;