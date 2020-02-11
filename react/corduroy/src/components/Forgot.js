import React, { Component } from 'react';// import logo from './logo.svg';


class Forgot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
        }
    }

    render = () => {
        return (
            <div>
                Forgotten Password
                <form onSubmit={(event) => { this.handleSubmit(event)}}>
                    Please enter your email
                    Username :<input type='text' value={this.state.username} onChange={(event) => this.setState({username: event.target.value})}/>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        )
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Sending password reset email for: " + this.state.username);
    }
}

export default Forgot;
