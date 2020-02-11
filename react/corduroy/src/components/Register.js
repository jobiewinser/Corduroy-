import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import serverConfig from '../config/server.config';
import {FormControl, Button, Container, Alert} from 'react-bootstrap';


class Register extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password2: '',
            success: [],
            errors: [],
        }
    }

    render = () => {
        return (
            <Container>
                <h1>Register here</h1>
                {
                    this.state.success.map((message) => {
                        return <Alert className="alert-success" key={message}>{message}</Alert>
                    })
                }
                {
                    this.state.errors.map((message) => {
                        return <Alert className="alert-danger" key={message}>{message}</Alert>
                    })
                }
                <form onSubmit={ (event) => {this.onSubmitHandler(event) }}>
                    Username: <FormControl type='text' value={ this.state.username } name='username' onChange={(e) => {this.formChangeHandler(e)}}/>
                    Password: <FormControl type='password' value={ this.state.password } name='password' onChange={(e) => {this.formChangeHandler(e)}}/>
                    Re-enter: <FormControl type='password' value={ this.state.password2 } name='password2' onChange={(e) => {this.formChangeHandler(e)}}/>
                    <Button type='submit' disabled={!this.canSubmit()} >Submit</Button>
                </form>
                <Link to='/'>Back to login</Link>
            </Container>
        )
    }

    canSubmit = () => {
        return !!this.state.username && !!this.state.password && this.state.password === this.state.password2;
    }

    formChangeHandler = (event) => {
        this.setState({[event.target.name] : event.target.value})
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        if(!this.canSubmit()) {
            return;
        }
        axios.post(`${serverConfig.serverUrl}/auth/register`, {
            username: this.state.username,
            password: this.state.password,
        })
            .then(response => {
                this.setState({success: ['Registered successfully'], errors: []});
            }).catch(error => {
                this.setState({errors: ['User  is taken'], success: []});
            })
    }
}

export default Register;
