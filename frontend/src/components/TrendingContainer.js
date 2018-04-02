import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import TrendingList from './TrendingList';

export default class TrendingContainer extends Component {

    getGifs = () => {
        return axios.get('http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
            .then(response => {
                this.setState({
                    giphys: response.data.data
                });
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
    }

    getHashtags = () => {
        return axios.get('https://api.twitter.com/1.1/trends/place.json')
            .then(response => {
                this.setState({
                    hashtags: response.data.trends
                });
            })
            .catch(error => {
                console.log('Error fetching and parsing data', error);
            });
    }

    componentDidMount() {
        Promise.all([this.getGifs(), this.getHashtags()]);
    }

    getTotalHashtags = () => this.state.hashtags.length;

    getTotalGiphys = () => this.state.giphys.length;

    render() {
        return (
            <div>
                <TrendingList />
            </div>
        )
    }
}

TrendingContainer.propTypes = {
    hashtagdata: PropTypes.array.isRequired,
    giphydata: PropTypes.array.isRequired
}