import React, { Component } from 'react';
import axios from 'axios';

import TrendingList from './TrendingList';

export default class TrendingContainer extends Component {

    constructor() {
        super();
        this.state = {
            hashtags: [],
            giphys: []
        }
    }

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
        // axios.get('http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
        //     .then(response => {
        //         this.setState({
        //             giphys: response.data.data
        //         });
        //     })
        //     .catch(error => {
        //         console.log('Error fetching and parsing data', error);
        //     });

        // refactor above request to use async await, hitting Twitter API as well
        async function apiCall() {
            try {
                await Promise.all([this.getGifs(), this.getHashtags()]);
            } catch (error) {
                console.log(error);
            }
        }

        apiCall();
    }

    getTotalHashtags = () => this.state.hashtags.length;

    getTotalGiphys = () => this.state.giphys.length;

    render() {
        console.log(this.state.giphys);
        return (
            <div>
                <TrendingList giphydata={this.state.giphys} hashtagdata={this.state.hashtags} />
            </div>
        )
    }
}