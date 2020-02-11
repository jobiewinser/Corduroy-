import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import serverConfig from '../config/server.config';
import {FormGroup, FormControl, FormLabel, Button} from 'react-bootstrap';
import '../App.css';

class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message: '',
            redirectTo: null,
            showError: false
        }
    }

    render = () => {
        if (this.state.redirectTo) {
            return <Redirect to={{pathname: this.state.redirectTo}} />
        }
        else {

            //show error message on wrong pass
            const withErrorHandling = WrappedComponent => ({ showError, children }) => {
                return (
                    <WrappedComponent>
                        {showError && <div className="error-message">Invalid username/password combination, try again</div>}
                        {children}
                    </WrappedComponent>
                );
            };

            const DivWithErrorHandling = withErrorHandling(({children}) => <div>{children}</div>)

            return (

                <div className="LoginPage">

                    <form className="LoginForm" onSubmit={(event) => { this.handleSubmit(event)}}>


                        <FormGroup controlId="email">
                            <h1 className="LoginTitle">Corduroy</h1>
                            <br></br>
                            <FormLabel>Email</FormLabel>
                            <FormControl
                                autoFocus
                                type="text"
                                value={this.state.username}
                                onChange={(event) => this.setState({username: event.target.value})}
                            />
                        </FormGroup>
                        <FormGroup controlId="password">
                            <FormLabel>Password</FormLabel>
                            <FormControl
                                value={this.state.password}
                                type="password"
                                onChange={(event) => this.setState({password: event.target.value})}

                            />
                        </FormGroup>
                        <Button className="LoginButton" block disabled={false} type="submit">
                            Login
                        </Button>
                        <br></br>
                        <Link to='/register'>Register</Link>
                        <br></br>
                        <br></br>
                        <DivWithErrorHandling showError={this.state.showError}>
                        </DivWithErrorHandling>
                    </form>

                </div>
            )
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${serverConfig.serverUrl}/auth/login`, {
            username: this.state.username,
            password: this.state.password
            })
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    this.setState({
                        redirectTo: '/dashboard'
                    })
                }
            }).catch(error => {
                console.log(error);
            this.setState((prevState, props) => {
                return { showError: true }
            })


            })
    }
}

export default Login;