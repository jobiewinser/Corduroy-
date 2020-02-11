import React, { Component } from 'react';// import logo from './logo.svg';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Navbar, Nav, Dropdown} from 'react-bootstrap';

class NavBar extends Component {
    render = () => {
        return (
            <div className="NavBar">

                <Navbar bg="light" expand="lg">
                    <a href={"/dashboard"}>
                        <img src={ require('../images/corduroy.png') } alt="Default company logo"/>
                    </a>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <h1 className={"Title"}>  Corduroy</h1>
                        </Nav>
                        <Dropdown>
                            <Dropdown.Toggle className = "dropDownUser" variant="success" id="dropdown-basic">
                                User
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Collapse>
                </Navbar>
                <br></br>
            </div>

        );
    }
}

export default NavBar;
