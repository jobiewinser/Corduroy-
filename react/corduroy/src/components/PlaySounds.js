import React, { Component } from 'react';
import { onPlaySounds } from '../api/sound.socket';

class PlaySounds extends Component{

    constructor(props) {
        super(props);
        this.state = {
            videoLink: '',
        }
    }

    render = () => {
        return (
            <div>
                <h1>Sound centre</h1>
                {
                    this.state.videoLink ? 
                    <iframe width="560" height="315" src={this.state.videoLink} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    : null
                }
            </div>
        )
    }

    componentDidMount = () => {
        onPlaySounds((message) => {
            this.setState({videoLink: message});

            setTimeout(() => {
                this.setState({videoLink: null});
            }, 1800 * 1000);
        });
    }
}

export default PlaySounds;